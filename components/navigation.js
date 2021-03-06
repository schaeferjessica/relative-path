import Link from 'next/link'
import Container from "./container"

export default function Navigation() {
  return (
  <Container>
    <nav className="sm:flex sm:justify-between sm:items-center mt-4 sm:mt-6">
      <h1 className=''><Link href="/">./_relative-path.dev</Link></h1>
      <ul className="flex mt-2 sm:mt-0">
        <li className="mr-3 sm:ml-4 underline-text uppercase"><Link href="/how-to-use">How to Use</Link></li>
        {/* <li className="mr-3 sm:ml-4"><button className="underline-text uppercase">Dark Mode</button></li> */}
        <li className="mr-3 sm:ml-4"><a className="underline-text uppercase block" href="https://github.com/schaeferjessica/directory-path" target="_blank" rel="noreferrer">Github</a></li>
      </ul>
    </nav>
  </Container>
  )
}