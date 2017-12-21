#[macro_use]
extern crate neon;
extern crate image;
extern crate screenshot;
extern crate bmp;
// extern crate dssim;

use screenshot::get_screenshot;
// use bmp::{Image, Pixel};
// use std::path::Path;
// use dssim::*;
use neon::vm::{Call, JsResult};
use neon::js::JsString;
use neon::js::JsNumber;
use std::fs::File;

fn screen(call: Call) -> JsResult<JsString> {
    let scope = call.scope;

    let destination = call.arguments.require(scope, 0)?.check::<JsString>()?.value();
    let mut width = call.arguments.require(scope, 1)?.check::<JsNumber>()?.value() as usize;
    let mut height = call.arguments.require(scope, 2)?.check::<JsNumber>()?.value() as usize;
    let left = call.arguments.require(scope, 3)?.check::<JsNumber>()?.value() as usize;
    let top = call.arguments.require(scope, 4)?.check::<JsNumber>()?.value() as usize;
    let scale = call.arguments.require(scope, 5)?.check::<JsNumber>()?.value() as f32;
    let contrast = call.arguments.require(scope, 6)?.check::<JsNumber>()?.value() as f32;

    println!("screen({}, {}, {}, {}, {}, {}, {})", destination, width, height, left, top, scale, contrast);

    let s = get_screenshot(0).unwrap();
    let pixel_width = s.pixel_width() / 2;

    if width == 0 {
        width = s.width();
    }
    if height == 0 {
        height = s.height();
    }

    let realw = width * pixel_width;
    let realh = height * pixel_width;

    // let mut img = Image::new(width as u32, height as u32);
    let mut imgbuf = image::ImageBuffer::new(realw as u32, realh as u32);

    for (x, y, pixel) in imgbuf.enumerate_pixels_mut() {
        let x2 = x as usize + left * pixel_width;
        let y2 = y as usize + top * pixel_width;
        // y, x
        let p = s.get_pixel(y2, x2);
        *pixel = image::Rgb([p.r as u8, p.g as u8, p.b as u8]);
    }

    // must always run because pixel sizes are weird
    let final_width = ((width as f32) * scale).round();
    let final_height = ((height as f32) * scale).round();
    println!("final_width, final_height {}, {}", final_width, final_height);
    imgbuf = image::imageops::resize(&imgbuf, final_width as u32, final_height as u32, image::FilterType::Lanczos3);

    if contrast != 1.0 {
        imgbuf = image::imageops::colorops::contrast(&imgbuf, contrast);
    }

    let fout = &mut File::create(&destination).unwrap();
    image::ImageRgb8(imgbuf).save(fout, image::PNG).unwrap();

    // return saved path as string
    Ok(JsString::new(scope, &destination).unwrap())
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