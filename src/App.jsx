import { useState, useEffect } from "react";
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://open.er-api.com/v6/latest/USD')
        const uniqueCurrencies = [...new Set(['USD', ...Object.keys(response.data.rates)])].sort()
        setCurrencies(uniqueCurrencies)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar moedas:', error)
        setLoading(false)
      }
    }
    fetchCurrencies()
  }, [])

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`)
        setExchangeRate(response.data.rates[toCurrency])
      } catch (error) {
        console.error('Erro ao buscar câmbio da moeda:', error)
      }
    }
    getExchangeRate()
  }, [fromCurrency, toCurrency])

  const convertedAmount = amount * exchangeRate

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container">
      <h1>Conversor de Moedas</h1>

      <div className="conversor">
        <div className="grupo-input">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <div className="igual">=</div>

        <div className="grupo-input">
          <input type="number" value={convertedAmount.toFixed(2)} readOnly />
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>

      {/* <footer className="footer">
        <p>Desenvolvido com:</p>
        <div className="logos">
          <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} alt="Vite Logo" className="logo" />
          </a>
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} alt="React Logo" className="logo" />
          </a>
        </div>
      </footer> */}
    </div>
  )
}

export default App