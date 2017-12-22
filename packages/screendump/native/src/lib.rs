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

    // println!("screen(dest: {}, width: {}, height: {}, left: {}, top: {}, scale: {}, contrast: {})", destination, width, height, left, top, scale, contrast);

    let s = get_screenshot(0).unwrap();
    let pixel_width = s.pixel_width() / 2;

    if width == 0 {
        width = s.width() / pixel_width;
    }
    if height == 0 {
        height = s.height() / pixel_width;
    }


    let realw = width * pixel_width;
    let realh = height * pixel_width;

    // println!("realw, realh: {}, {}", realw, realh);

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

    // println!("final_width, final_height {}, {}", final_width, final_height);
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
