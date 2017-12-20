#[macro_use]
extern crate neon;

use std::time::Duration;
use std::thread;
// use std::path::Path;
use dssim::*;
use neon::vm::{Call, JsResult};
use neon::js::JsString;
use neon::js::JsNumber;

fn screen(call: Call) -> JsResult<JsString> {
    let scope = call.scope;

    let outfile = call.arguments.require(scope, 0)?.check::<JsString>()?.value();
    let mut width = call.arguments.require(scope, 1)?.check::<JsNumber>()?.value() as usize;
    let mut height = call.arguments.require(scope, 2)?.check::<JsNumber>()?.value() as usize;
    let left = call.arguments.require(scope, 3)?.check::<JsNumber>()?.value() as usize;
    let top = call.arguments.require(scope, 4)?.check::<JsNumber>()?.value() as usize;

    println!("screen({}, {}, {}, {}, {})", outfile, width, height, left, top);

    let s = get_screenshot(0).unwrap();
    let pxwidth = s.pixel_width();

    if width == 0 {
        width = s.width() / (pxwidth / 2);
    }
    if height == 0 {
        height = s.height() / (pxwidth / 2);
    }

    width = width * pxwidth / 2;
    height = height * pxwidth / 2;

    let mut img = Image::new(width as u32, height as u32);

    for row in 0..height {
        for col in 0..width {
            let p = s.get_pixel(row + top, col + left);
            img.set_pixel(col as u32, row as u32, Pixel{ r: p.r, g: p.g, b: p.b });
        }
    }

    img.save(&outfile).unwrap();

    // return saved path as string
    Ok(JsString::new(scope, &outfile).unwrap())
}

register_module!(m, {
    m.export("screen", screen)
});


// fn main() {


	// println!("---- {} x {} x {} = {} bytes ------", s1.height(), s1.width(), s1.pixel_width(), s1.raw_len());

// 	thread::sleep(Duration::from_millis(50));

// 	let s2 = get_screenshot(0).unwrap();
// 	let mut diffimg = Image::new(s1.width() as u32, s1.height() as u32);

// 	// start them at their worst assumption!
// 	// so basically inverse of a full bounding box...
// 	let mut left = s1.width();
// 	let mut right = 0;
// 	let mut top = s1.height();
// 	let mut bottom = 0;

// 	// 40 == menubar height
// 	for y in 40..s1.height() {
// 		for x in 0..s1.width() {
// 			let p1 = s1.get_pixel(y, x);
// 			let p2 = s2.get_pixel(y, x);
// 			let r = p1.r - p2.r;
// 			let g = p1.g - p2.g;
// 			let b = p1.b - p2.b;
// 			if r == 0 && g == 0 && b == 0 {
// 				// println!("blank pixel")
// 			} else {
// 				// they are at their max
// 				// this adjusts each down towards its min
// 				// min === most amt of screen visible
// 				if x < left  {
// 					left = x;
// 				}
// 				if x > right {
// 					right = x;
// 				}
// 				if y > bottom {
// 					bottom = x;
// 				}
// 				if y < top {
// 					top = y;
// 				}
// 				// WARNING rust-bmp params are (x, x)
// 			}
// 			diffimg.set_pixel(x as u32, y as u32, Pixel {r: r, g: g, b: b});
// 		}
// 	}

// 	diffimg.save("./build/testdiff.bmp").unwrap();

// 	println!("Found bounding box [{}, {}, {}, {}]", top, right, bottom, left);

// 	if right <= left || top >= bottom {
// 		println!("no diff");
// 	} else {
// 		let width = right - left;
// 		let height = bottom - top;
// 		println!("width {} height {}", width, height);

// 		let imageWidth = width *  s1.pixel_width();
// 		let imageHeight = height *  s1.pixel_width();

// 		let mut diffScreenshot = Image::new(imageWidth as u32, imageHeight as u32);

// 		// color in bounding box
// 		for y in 0..height {
// 			for x in 0..width {
// 				let screenX = x + left;
// 				let screenY = y + top;
// 				if screenY > imageHeight || screenX > imageWidth {
// 					println!("{} > {} || {} > {}", screenY, height, screenX, width);
// 					continue
// 				}
// 				let p2 = s2.get_pixel(screenY, screenX);
// 				diffScreenshot.set_pixel(x as u32, y as u32, Pixel {r: p2.r, g: p2.g, b: p2.b});
// 			}
// 		}

// 		// println!("{} x {}", s1.width(), s1.height());

// 		diffScreenshot.save("./build/test.bmp").unwrap();

// 		println!("done");
// 	}

// 	// let s2 = get_screenshot(0).unwrap();

// 	// let mut attr = dssim::Dssim::new();
// 	// let image1 = attr.create_image(&img).ok_or_else(|| format!("Can't use internal error"))?;
// 	// let image2 = attr.create_image(&s2).ok_or_else(|| format!("Can't use internal error"))?;

// 	// let (dssim, ssim_maps) = attr.compare(&image1, image2);
// 	// println!("{}", dssim);

// 	// let height = (s.width() / 2);
// 	// let width = (s.height() / 2);
// 	// image::save_buffer(&Path::new("test.png"),
// 	// 	s.as_ref(), height as u32, width as u32, image::RGBA(8))
// 	// .unwrap();
// }