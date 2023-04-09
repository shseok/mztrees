import * as React from 'react'
import { SVGProps } from 'react'
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 15" {...props}>
    <path
      fill="currentColor"
      d="M16.309 15h-4.536V7.896h-.12L10.237 15h-4.2L4.645 7.896h-.12V15H.037L.613.096h6.384L8.125 6.84h.216L9.445.096h6.312L16.309 15Zm13.27 0h-11.28l-.168-2.568L22.739 4.2H17.77L17.507.096h11.688l.168 2.52-4.32 8.568h4.536V15Z"
    />
  </svg>
)
export default SvgLogo
