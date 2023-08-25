import Footer from './components/common/Footer'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'

function App({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      {children}
      {/* <Footer /> */}
    </>
  )
}

export default App
