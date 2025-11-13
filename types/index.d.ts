/// <reference types="react" />
/// <reference types="react-native" />

declare module 'react-native-fast-image' {
  import { Component } from 'react';
  import { ImageProps, ImageURISource, StyleProp, ImageStyle } from 'react-native';

  export interface Source {
    uri?: string;
    headers?: { [key: string]: string };
    priority?: 'low' | 'normal' | 'high';
    cache?: 'immutable' | 'web' | 'cacheOnly';
  }

  export interface FastImageProps extends ImageProps {
    source: Source | ImageURISource | number;
    style?: StyleProp<ImageStyle>;
    resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
    onLoadStart?(): void;
    onProgress?(event: { nativeEvent: { loaded: number; total: number } }): void;
    onLoad?(event: { nativeEvent: any }): void;
    onError?(): void;
    onLoadEnd?(): void;
  }

  export default class FastImage extends Component<FastImageProps> {
    static resizeMode: {
      contain: 'contain';
      cover: 'cover';
      stretch: 'stretch';
      center: 'center';
    };
    static priority: {
      low: 'low';
      normal: 'normal';
      high: 'high';
    };
    static cacheControl: {
      immutable: 'immutable';
      web: 'web';
      cacheOnly: 'cacheOnly';
    };
    static preload(sources: Source[]): void;
    static clearMemoryCache(): Promise<void>;
    static clearDiskCache(): Promise<void>;
  }
}
