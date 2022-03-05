declare module '@adrianso/react-native-device-brightness' {
  export function getSystemBrightnessLevel(): Promise<number>
}

declare module 'react-native-advertising-id'

declare module 'react-native-exif' {
  interface Meta {
    ApertureValue?: any
    BitsPerSample?: any
    BrightnessValue?: any
    ColorSpace: string
    ComponentsConfiguration: string
    CompressedBitsPerPixel?: any
    Compression: string
    Contrast?: any
    CustomRendered?: any
    DateTime: string
    DateTimeDigitized: string
    DateTimeOriginal: string
    DigitalZoomRatio: string
    ExifVersion: string
    ExposureBiasValue: string
    ExposureMode: string
    ExposureProgram: string
    ExposureTime: string
    FNumber: string
    FileSource?: any
    Flash: string
    FlashpixVersion: string
    FocalLengthIn35mmFilm?: any
    GPSAltitudeRef?: any
    GPSDateStamp?: any
    GPSLatitude?: any
    GPSLatitudeRef?: any
    GPSLongitude?: any
    GPSLongitudeRef?: any
    GPSProcessingMethod?: any
    GainControl?: any
    ISOSpeedRatings: string
    ImageLength: string
    ImageWidth: string
    InteroperabilityIndex: string
    LightSource: string
    Make: string
    MakerNote?: any
    MaxApertureValue?: any
    MeteringMode: string
    Model: string
    Orientation: string
    PixelXDimension: string
    PixelYDimension: string
    ResolutionUnit: string
    Saturation?: any
    SceneCaptureType: string
    SceneType?: any
    SensingMethod?: any
    Sharpness?: any
    ShutterSpeedValue?: any
    Software: string
    StripByteCounts?: any
    SubSecTime: string
    SubSecTimeDigitized: string
    SubSecTimeOriginal: string
    SubjectDistanceRange?: any
    ThumbnailImageLength?: any
    ThumbnailImageWidth?: any
    UserComment?: any
    WhiteBalance: string
    XResolution: string
    YCbCrPositioning: string
    YResolution: string
    originalUri: string
  }

  export interface Exif {
    ImageWidth: number
    ImageHeight: number
    Orientation: number
    originalUri: any
    exif: Meta
  }
  export function getExif(uri: string): Promise<Exif>
}
