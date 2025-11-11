/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts'
import window from '@ohos.window';
import image from '@ohos.multimedia.image';
import Logger from './Logger';

export class SplashScreen extends TurboModule implements TM.SplashScreen.Spec {
  static NAME = "SplashScreen"

  // 启动图片
  public static startWindowIcon;

  // 子窗口
  private static splashWindow;

  constructor(ctx: TurboModuleContext) {
    super(ctx)
  }

  /**
   * 显示启动屏
   *
   */
  public static async show(abilityContext: any,
                           windowStage: window.WindowStage,
                           iconResource: any,
                           backgroundColor: string,
                           pageUrl: string) {
    // 获取resourceManager资源管理
    const context = abilityContext;
    const resourceMgr = context.resourceManager
    // 获取rawfile文件夹下startIcon的ArrayBuffer
    const fileData = await resourceMgr.getMediaContent(iconResource)
    const buffer = fileData.buffer
    // 创建imageSource
    const imageSource = image.createImageSource(buffer)
    // 创建PixelMap
    const pixelMap = await imageSource.createPixelMap()
    this.startWindowIcon = pixelMap;

    // 创建子窗口
    windowStage.createSubWindow("SplashScreenWindow", (err, data) => {
      if (err.code) {
        Logger.error('Failed to create the subwindow. Cause: ' + JSON.stringify(err));
        return;
      }
      this.splashWindow = data;

      // 设置子窗口全屏
      this.splashWindow.setFullScreen(true);

      // 为子窗口加载对应的目标页面
      this.splashWindow.setUIContent(pageUrl, (err) => {
        if (err.code) {
          Logger.error('Failed to load the content. Cause:' + JSON.stringify(err));
          return;
        }
        // 显示子窗口
        this.splashWindow.showWindow((err) => {
          if (err.code) {
            Logger.error('Failed to show the window. Cause: ' + JSON.stringify(err));
            return;
          }
          Logger.debug('Succeeded in showing the window.');
        });
        this.splashWindow.setWindowBackgroundColor(backgroundColor)
      });
    })
  }

  /**
   * 关闭启动屏
   */
  public hide() {
    // 销毁子窗口
    SplashScreen.splashWindow.destroyWindow((err) => {
      if (err.code) {
        Logger.error('Failed to destroy the window. Cause: ' + JSON.stringify(err));
        return;
      }
    });
  }
  /**
   * 关闭启动屏
   */
  public static hide() {
    // 销毁子窗口
    SplashScreen.splashWindow.destroyWindow((err) => {
      if (err.code) {
        Logger.error('Failed to destroy the window. Cause: ' + JSON.stringify(err));
        return;
      }
    });
  }
}
