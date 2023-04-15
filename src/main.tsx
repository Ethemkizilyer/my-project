
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PersistGate } from 'redux-persist/integration/react'


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
 
    <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <App /></Provider></QueryClientProvider></PersistGate>

)
