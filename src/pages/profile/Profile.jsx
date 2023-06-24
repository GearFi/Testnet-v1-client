import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from "react-router";
import './profile.css'
import axios from 'axios'
import userProfile from '../../assets/userProfile.jpg'
import Web3 from 'web3'

/***************************************************************** */
import { AiOutlineArrowRight } from 'react-icons/ai'

const Profile = () => {
  const [listings, setListings] = React.useState(true)
  const [nftData, setNftData] = useState([])
  const location = useLocation();
  const address = location.state?.data;
  useEffect(() => {
    console.log('selected', window.ethereum.selectedAddress)
    axios(`http://localhost:8000/assets?owner=${address}`).then(({ data }) => {
      console.log('krishna!!')
      // console.log('datacollection ', data)
      setNftData(data)
    })
  }, [])

  // useEffect(() => {
  //   const fetchNftData = async () => {
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: 'eth_accounts',
  //       })
  //       const selectedAddress = accounts[0]
  //       console.log('selected', selectedAddress)

  //       const response = await axios.get(
  //         `http://localhost:8000/assets?owner=${selectedAddress}`
  //       )
  //       const data = response.data
  //       console.log('krishna!!')
  //       setNftData(data)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }

  //   fetchNftData()

  //   const handleAccountsChanged = (accounts) => {
  //     if (accounts.length > 0) {
  //       const selectedAddress = accounts[0]
  //       console.log('selected', selectedAddress)
  //       axios(`http://localhost:8000/assets?owner=${selectedAddress}`).then(
  //         ({ data }) => {
  //           console.log('krishna!!')
  //           setNftData(data)
  //         }
  //       )
  //     }
  //   }

  //   window.ethereum.on('accountsChanged', handleAccountsChanged)

  //   return () => {
  //     window.ethereum.off('accountsChanged', handleAccountsChanged)
  //   }
  // }, [])

  if (window.ethereum) {
    console.log('fsjkdhfsg')
    const provider = new Web3(window.ethereum)

    // Listen for selected address changes
    window.ethereum.on('accountsChanged', function (accounts) {
      const selectedAddress = accounts[0]
      axios(
        `http://localhost:8000/assets?owner=${window.ethereum.selectedAddress}`
      ).then(({ data }) => {
        console.log('krishna!!')
        // console.log('datacollection ', data)
        setNftData(data)
      })
    })
  }

  console.log('datacollection ', nftData)
  return (
    <div className='text-white mt-20'>
      <div className='flex flex-col items-center'>
        <img src={userProfile} alt='' className='w-24 mt-8 rounded-full' />
        <div className=' text-4xl font-bold mb-2'>Shane Helm</div>
        <div className=''>Joined 11/11/12 address: 2e4c...a7df</div>
      </div>
      <div className='flex justify-start'>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            listings ? 'text-red-600' : ''
          }`}
          onClick={() => setListings(true)}
        >
          My Listings
        </div>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            !listings ? 'text-red-600' : ''
          }`}
          onClick={() => setListings(false)}
        >
          NFTs
        </div>
      </div>
      {listings && (
        <div className='grid grid-cols-5 m-2'>
          {nftData.map((nft) => {
            console.log('nft', nft.state)
            if (nft.state === 'listed' || nft.state === 'margin-trade')
              return (
                <Link
                  to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                  state={{ data: nft }}
                >
                  <div className='flex flex-col m-2 mt-8 w-56 h-72 border-2 border-indigo-300'>
                    <img
                      src={`https://ipfs.io/ipfs/${
                        nft.metadata?.imageURI.split('//')[1]
                      }`}
                      alt=''
                      className='w-64 h-48'
                    />
                    <div className='flex flex-col mt-0 p-4'>
                      <div className='font-bold mb-2 flex items-center justify-between'>
                        <div>{nft.metadata?.name}</div>
                        <div>
                          <AiOutlineArrowRight className='mr-4' />
                        </div>
                      </div>
                      <div className='flex'>
                        <div className='w-24 text-sm'>
                          FLOOR PRICE:
                          <br />
                          {nft.price}
                        </div>
                        <div className='ml-4 w-20 text-sm'>
                          LAST SALE:
                          <br />
                          {nft.lastSale}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
          })}
        </div>
      )}
      {!listings && (
        <div className='grid grid-cols-5 m-2'>
          {nftData.map((nft) => {
            return (
              <Link
                to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                state={{ data: nft }}
              >
                <div className='flex flex-col m-2 mt-8 w-56 h-72 border-2 border-indigo-300'>
                  <img
                    src={`https://ipfs.io/ipfs/${
                      nft.metadata?.imageURI.split('//')[1]
                    }`}
                    alt=''
                    className='w-64 h-48'
                  />
                  <div className='flex flex-col mt-0 p-4'>
                    <div className='font-bold mb-2 flex items-center justify-between'>
                      <div>{nft.metadata?.name}</div>
                      <div>
                        <AiOutlineArrowRight className='mr-4' />
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='w-24 text-sm'>
                        FLOOR PRICE:
                        <br />
                        {nft.price}
                      </div>
                      <div className='ml-4 w-20 text-sm'>
                        LAST SALE:
                        <br />
                        {nft.lastSale}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Profile
