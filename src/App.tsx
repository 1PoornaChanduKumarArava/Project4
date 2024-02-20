import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import { faWind } from '@fortawesome/free-solid-svg-icons';


function App() {
  // const [city, setCity] = useState('')

  const [cityname, setCityName] = useState('')
  const [countryname, setCountryName] = useState('')
  const [temperature, setTemperature]= useState()
  const [fahrenheit,setFahrenheit]=useState('')
  const [weathercondi, setweathercondi]=useState()
  const [condition, setCondition]=useState('')
  const [previousValue, setPreviousvalues]= useState<string[]>([])
  const [icon,setIcon]=useState('')
  const [error,setError]=useState('')
  // const [previousContent, setPreviousContent]=useState([])

  const locationname = useRef<HTMLInputElement | null>(null);

  const searchHandler = ()=>{
    let locationValue = locationname.current?.value || '';
    setCityName(locationValue)
    setPreviousvalues(prev=>[...prev,locationValue])
    
    while (previousValue.length===5){
        previousValue.shift()
    }
    
    if (locationname.current) {
      locationname.current.value = '';
    }
  }



  const getCurrentLocation = ()=>{
    if ('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition((position)=>{
        axios.get(`http://api.weatherapi.com/v1/current.json?key=d196625b76d6401e84a150550231412&q=${position.coords.latitude},${position.coords.longitude}`).then((response)=>{
          setError('')
          setCityName(response.data.location.name)
          setIcon(response.data.current.condition.icon)
          setCountryName(response.data.location.country)
          setTemperature(response.data.current.temp_c)
          setFahrenheit(response.data.current.temp_f)
          setweathercondi(response.data.current.wind_kph)
          // setPreviousvalues(prev=>[...prev,cityname])
        })
    })
    }else{
      setError("Geo Location not supported")
    }   
  }


  const url=`http://api.weatherapi.com/v1/current.json?key=d196625b76d6401e84a150550231412&q=${cityname}`
 
  useEffect(()=>{
    axios.get(url).then((response:any)=>{
      setCityName(response.data.location.name)
      setIcon(response.data.current.condition.icon)
      setCountryName(response.data.location.country)
      setTemperature(response.data.current.temp_c)
      setFahrenheit(response.data.current.temp_f)
      setweathercondi(response.data.current.wind_kph)
      setCondition(response.data.current.condition.text)
      setError('')

    }).catch(()=>{
      setError("Please Enter a Valid City Name")
      console.log("INTIAL AXIOS ERROR")
      setCityName('')
    })
    // LocalStorage()
    },[url])


  return (
  <>
  <div className='main'>
    <div className='center'>
    <div className='container'>
      <div className='head-container container1'>
          <h1>WEATHER APP</h1>
          <div className="make-flex">
            <input className='input1' placeholder='Search your city' ref={locationname} />
            <button className='btn1' onClick={searchHandler}>SEARCH</button>
            <button className='btn1' onClick={getCurrentLocation}>Use Current Location</button>
          </div>
      </div>


        <br></br>

        {error==='' ? 
        <div className='bottom-container container2'>
          <div>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> &nbsp; City Name: {cityname } </p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> &nbsp; Country Name: {countryname}</p>
            <p><FontAwesomeIcon icon={faTemperatureHigh} /> &nbsp; Temperature in Celsius: {temperature} </p>
            <p><FontAwesomeIcon icon={faTemperatureHigh} /> &nbsp; Temperature in Fahrenheit: {fahrenheit} </p>
            <p><FontAwesomeIcon icon={faWind} /> &nbsp; Weather Conditions: {weathercondi} </p>
            <p><FontAwesomeIcon icon={faWind} /> &nbsp; Conditions: {condition}</p>
          </div>
          <div>
          <img src={icon}/>
          
          </div>
        </div> 
                  : 
        <div className='bottom-container red'>{error}</div>
        }


        <div className='container3'>
          <h2>Recent Searches</h2>
            {
              previousValue.map((item)=>(
                <p>{item}</p>
              ))
            }
        </div>

    </div>
  </div>
  </div>




    
  </>
  )

}

export default App
