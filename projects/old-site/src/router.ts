import { Router } from '@o/router'
// import { FeaturesPage } from './pages/FeaturesPage'
// import { UseCasesPage } from './pages/UseCasesPage'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

function runRouter() {
  return new Router({
    routes: {
      '/': HomePage,
      // '/features': FeaturesPage,
      // '/use-cases': UseCasesPage,
      '/about': AboutPage,
      '/privacy': PrivacyPage,
      '/terms': TermsPage,
    },
  })
}

let AppRouter = runRouter()

// because doing in installDevTools would break import order
window.Router = AppRouter

window.restartRouter = () => {
  AppRouter = runRouter()
  window.Router = AppRouter
}

export default AppRouter
