export type UserInfo = {
  id: string
  name: string
  surname: string
}

export type GetUserInfoById = (userId: string) => Promise<UserInfo>

export type GetUserImageById = (userId: string) => Promise<string | null>

export type UserImageProps = {
  userId: string
  getUserInfoById: GetUserInfoById
  getUserImageById: GetUserImageById
  openProfileInNewTab?: boolean
  size?: "default" | "sm" | "lg"
  className?: string
}
