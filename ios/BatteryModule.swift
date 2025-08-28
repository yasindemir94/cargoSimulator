//
//  BatteryModule.swift
//  cargoSimulator
//
//  Created by Yasin Demir on 27.08.2025.
//

import Foundation
import UIKit
import React

@objc(BatteryModule)
class BatteryModule: NSObject {
  
  @objc(getBatteryLevel:rejecter:)
  func getBatteryLevel(resolver: RCTPromiseResolveBlock,
                       rejecter: RCTPromiseRejectBlock) {
    UIDevice.current.isBatteryMonitoringEnabled = true
    let batteryLevel = UIDevice.current.batteryLevel
    
    if batteryLevel < 0 {
      rejecter("E_BATTERY", "Battery level unavailable", NSError(domain: "", code: 200, userInfo: nil))
    } else {
      let percentage = Int(batteryLevel * 100)
      resolver(percentage)
    }
  }
}
