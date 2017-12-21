//! Capture a bitmap image of a display. The resulting screenshot is stored in
//! the `Screenshot` type, which varies per platform.
//!
//! # Platform-specific details
//!
//! Despite OS X's CoreGraphics documentation, the bitmap returned has its
//! origin at the top left corner. It uses ARGB pixels.
//!
//! The Windows GDI bitmap has its coordinate origin at the bottom left. We
//! attempt to undo this by reordering the rows. Windows also uses ARGB pixels.

use std::intrinsics::{size_of, offset};
use std::slice;
use libc;
use stopwatch::{Stopwatch};

#[derive(Clone, Copy)]
pub struct Pixel {
	pub a: u8,
	pub r: u8,
	pub g: u8,
	pub b: u8,
}

pub struct Screenshot {
	data: Vec<u8>,
	height: usize,
	width: usize,
	row_len: usize, // Might be superfluous
	pixel_width: usize,
}

impl Screenshot {
	/// Height of image in pixels.
	#[inline]
	pub fn height(&self) -> usize { self.height }

	/// Width of image in pixels.
	#[inline]
	pub fn width(&self) -> usize { self.width }

	/// Number of bytes in one row of bitmap.
	#[inline]
	pub fn row_len(&self) -> usize { self.row_len }

	/// Width of pixel in bytes.
	#[inline]
	pub fn pixel_width(&self) -> usize { self.pixel_width }

	/// Raw bitmap.
	#[inline]
	pub unsafe fn raw_data(&self) -> *const u8 {
		&self.data[0] as *const u8
	}

	/// Raw bitmap.
	#[inline]
	pub unsafe fn raw_data_mut(&mut self) -> *mut u8 {
		&mut self.data[0] as *mut u8
	}

	/// Number of bytes in bitmap
	#[inline]
	pub fn raw_len(&self) -> usize {
		self.data.len() * unsafe {size_of::<u8>()}
	}

	/// Gets pixel at (row, col)
	pub fn get_pixel(&self, row: usize, col: usize) -> Pixel {
		let idx = (row*self.row_len() + col*self.pixel_width()) as isize;
		unsafe {
			let data = &self.data[0] as *const u8;
			if idx as usize > self.raw_len() { panic!("Bounds overflow"); }

			Pixel {
				a: *offset(data, idx+3),
				r: *offset(data, idx+2),
				g: *offset(data, idx+1),
				b: *offset(data, idx),
			}
		}
	}
}

impl AsRef<[u8]> for Screenshot {
	#[inline]
	fn as_ref<'a>(&'a self) -> &'a [u8] {
		self.data.as_slice()
	}
}

type ScreenResult = Result<Screenshot, &'static str>;


type CFIndex = libc::c_long;
type CFDataRef = *const u8; // *const CFData

#[cfg(target_arch = "x86")]
type CGFloat = libc::c_float;
#[cfg(target_arch = "x86_64")]
type CGFloat = libc::c_double;
type CGError = libc::int32_t;

type CGDirectDisplayID = libc::uint32_t;
type CGDisplayCount = libc::uint32_t;
type CGImageRef = *mut u8; // *mut CGImage
type CGDataProviderRef = *mut u8; // *mut CGDataProvider

type CGRectRef = *const u8;

const kCGErrorSuccess: CGError = 0;
const kCGErrorFailure: CGError = 1000;
const CGDisplayNoErr: CGError = kCGErrorSuccess;

#[link(name = "CoreGraphics", kind = "framework")]
extern "C" {
  fn CGGetActiveDisplayList(max_displays: libc::uint32_t,
                              active_displays: *mut CGDirectDisplayID,
                              display_count: *mut CGDisplayCount) -> CGError;
  fn CGImageRelease(image: CGImageRef);

  fn CGRect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) -> CGRectRef;
  fn CGDisplayCreateImage(displayID: CGDirectDisplayID) -> CGImageRef;

  fn CGImageGetBitsPerComponent(image: CGImageRef) -> libc::size_t;
  fn CGImageGetBitsPerPixel(image: CGImageRef) -> libc::size_t;
  fn CGImageGetBytesPerRow(image: CGImageRef) -> libc::size_t;
  fn CGImageGetDataProvider(image: CGImageRef) -> CGDataProviderRef;
  fn CGImageGetHeight(image: CGImageRef) -> libc::size_t;
  fn CGImageGetWidth(image: CGImageRef) -> libc::size_t;

  fn CGDataProviderCopyData(provider: CGDataProviderRef) -> CFDataRef;
}
#[link(name = "CoreFoundation", kind = "framework")]
extern "C" {
  fn CFDataGetLength (theData: CFDataRef) -> CFIndex;
  fn CFDataGetBytePtr(theData: CFDataRef) -> *const u8;
  fn CFRelease(cf: *const libc::c_void);
}

/// Get a screenshot of the requested display.
pub fn get_screenshot(screen: usize) -> ScreenResult {
  unsafe {
    let sw = Stopwatch::start_new();

    // Get number of displays
    let mut count: CGDisplayCount = 0;
    let mut err = CGDisplayNoErr;
    err = CGGetActiveDisplayList(0, 0 as *mut CGDirectDisplayID, &mut count);
    if err != CGDisplayNoErr {
      return Err("Error getting number of displays.");
    }

    println!("1 took {}ms", sw.elapsed_ms());

    // Get list of displays
    let mut disps: Vec<CGDisplayCount> = Vec::with_capacity(count as usize);
    disps.set_len(count as usize);
    err = CGGetActiveDisplayList(disps.len() as libc::uint32_t,
      &mut disps[0] as *mut CGDirectDisplayID,
      &mut count);
    if err != CGDisplayNoErr {
      return Err("Error getting list of displays.");
    }

    // Get screenshot of requested display
    let disp_id = disps[screen];

    println!("2 took {}ms", sw.elapsed_ms());

    // let rect = CGRect(0.0, 0.0, 100.0, 100.0);
    let cg_img = CGDisplayCreateImage(disp_id);

    println!("3 took {}ms", sw.elapsed_ms());

    // Get info about image
    let width = CGImageGetWidth(cg_img) as usize;
    let height = CGImageGetHeight(cg_img) as usize;
    let row_len = CGImageGetBytesPerRow(cg_img) as usize;
    let pixel_bits = CGImageGetBitsPerPixel(cg_img) as usize;

    if pixel_bits % 8 != 0 {
      return Err("Pixels aren't integral bytes.");
    }

    println!("4 took {}ms", sw.elapsed_ms());

    // Copy image into a Vec buffer
    let cf_data = CGDataProviderCopyData(CGImageGetDataProvider(cg_img));
    let raw_len = CFDataGetLength(cf_data) as usize;

    println!("5 took {}ms", sw.elapsed_ms());

    let res = if width*height*pixel_bits != raw_len*8 {
      // Err("Image size is inconsistent with W*H*D.")
      let data = slice::from_raw_parts(CFDataGetBytePtr(cf_data), raw_len).to_vec();
      Ok(Screenshot {
        data: data,
        height: height,
        width: width,
        row_len: row_len,
        pixel_width: pixel_bits/8
      })
    } else {
      let data = slice::from_raw_parts(CFDataGetBytePtr(cf_data), raw_len).to_vec();
      Ok(Screenshot {
        data: data,
        height: height,
        width: width,
        row_len: row_len,
        pixel_width: pixel_bits/8
      })
    };

    println!("6 took {}ms", sw.elapsed_ms());

    // Release native objects
    CGImageRelease(cg_img);
    CFRelease(cf_data as *const libc::c_void);

    println!("7 took {}ms", sw.elapsed_ms());

    return res;
  }
}