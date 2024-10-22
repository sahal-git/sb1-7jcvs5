export interface Image {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}