//
//  BatteryModuleBridge.m
//  cargoSimulator
//
//  Created by Yasin Demir on 27.08.2025.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BatteryModule, NSObject)
RCT_EXTERN_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
