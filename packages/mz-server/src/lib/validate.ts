const USER_REGEX = /^[a-z0-9]{5,20}$/
const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/
const LINK_REGEX = /^(http|https):\/\/[^ "]+$/

export const validate = {
  username: (text: string) => USER_REGEX.test(text),
  password: (text: string) => PWD_REGEX.test(text),
  link: (text: string) => LINK_REGEX.test(text),
}
