import { boolean } from "zod"

export interface PostData {
  blurredImages: string[],
  phone_number: string,
  city: string,
  caption: string,
  userId: string,
  name: string,
  images: string[],
  textDetected: boolean,
  faceDetected: boolean,
  country: string,
  lastName: string
}