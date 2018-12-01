
class BlurryEffectView: NSVisualEffectView {
  override func updateLayer() {
    super.updateLayer()
    
    let backdrop = self.layer!.sublayers!.first!
    
    if backdrop.sublayers != nil {
      for sublayer in backdrop.sublayers! {
        if sublayer.name == "Backdrop" {
          for filter in sublayer.filters! {
            print("------------------- \(type(of: filter))")
            //          let f = filter as [Filter]
            //          if filter.respondsToSelector("name") {
            //            if filter.name == "Backdrop" {
            //
            //            }
            //          }
          }
        }
      }
    }
  }
}
