import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import Logo from "../../static/images/Anim.-Logo-Header-+-Footer-CS.gif";
import WalletIcon from "../../static/images/Picto-wallet.svg";
import MetaMaskIcon from "../../static/images/metamask.svg";
import MobileMenu from "./MobileMenu";
import { connectWallet, disconnectWallet, getCoinbase, connectNetwork } from "../../functions/Setup";
import { setWalletConnectStatusAction, setNetConnectStatusAction, setCoinbaseAddressAction } from "../../store/actions";

const ConnectButton = styled('button')`
  font-size: 16px;
  color: white;
  text-transform: "uppercase";
  cursor: pointer;
  font-family: "Azonix";
  &.${buttonUnstyledClasses.disabled} {
    cursor: not-allowed;
  }
`;

const Menu = ({ title }) => {
  const connectStatus = useSelector((state) => state.isWalletConnect);
  const netStatus = useSelector((state) => state.isNetConnect);
  const walletAddress = useSelector((state) => state.coinbaseAddress);
  const { ethereum } = window
  const dispatch = useDispatch();

  window.addEventListener("load", function() {
    if (connectStatus) {
        ethereum.on('networkChanged', async function(networkId) {
          if (networkId != 0x3) {
              const network = await connectNetwork();
          }
        });
    }
  })

  const checkWalletIsConnected = async () => {
    if (ethereum) {
      try {
        const account = await getCoinbase();
        const currentNet = await ethereum.request({method: "eth_chainId"});

        if (account) {
          dispatch(setWalletConnectStatusAction(true))
          dispatch(setCoinbaseAddressAction(account))
          if (currentNet == 0x3) 
            dispatch(setNetConnectStatusAction(true))
          else {
            dispatch(setNetConnectStatusAction(false))
          }
        } else {
          dispatch(setWalletConnectStatusAction(false))
          dispatch(setNetConnectStatusAction(false))
          dispatch(setCoinbaseAddressAction(""))
        }
      } catch (e) {
        alertify.error(String(e))
      }
      
    }
  }
  
  // useEffect(() => {
  //   const s = setInterval(checkWalletIsConnected, 1000);
  //   return () => clearInterval(s);
  // }, []);

  const handleConnection = async () => {
    try {
      const connected = await connectWallet()
      const account = await getCoinbase();
      const network = await connectNetwork();
      console.log(account)
      dispatch(setWalletConnectStatusAction(connected))
      dispatch(setCoinbaseAddressAction(account))
      dispatch(setNetConnectStatusAction(network))
      console.log("connected", connected)
      console.log("connectStatus", connectStatus)
      console.log("netStatus",netStatus)
      if (network)
        alertify.success(String("Wallet Connected Successfully!"))
    } catch (e) {
      alertify.error(String(e))
    }
    // } else {
    //   try {
    //     const disconnect = await disconnectWallet()
    //     dispatch(setWalletConnectStatusAction(disconnect))
    //     dispatch(setCoinbaseAddressAction(""))
    //     alertify.success(String("Disconnected Wallet!"))
    //   } catch (e) {
    //     alertify.error(String(e))
    //   }
    // }
  }

  return (
    <Box>
      {isMobile 
        ? <MobileMenu handleConnection={handleConnection} netStatus={netStatus} connectStatus={connectStatus} walletAddress={walletAddress} />
        : <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Container maxWidth="xl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: "100px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignSelf: "center",
                    width: "100%",
                    maxWidth: "250px",
                  }}
                >
                  <Link to="/">
                    <img src={Logo}  width={450} height={51} alt="" />
                  </Link>
                </Box>
                {
                  (title ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignSelf: "center",
                      }}
                    >
                      <Link to="/">
                        <Box
                          sx={{
                            color: "#fff",
                            fontSize: "16px",
                            textTransform: "uppercase",
                            fontFamily: "Azonix",
                            paddingTop: "15px",
                            paddingBottom: "11px",
                            borderRadius: "4px",
                            paddingX: "20px",
                            width: "200px",
                            textAlign: "center",
                            border: `2px solid #00B951`,
                            cursor: "pointer",
                          }}
                        >
                          {title}
                        </Box>
                      </Link>
                    </Box>
                  ) : null)
                }
                <Box
                  sx={{
                    display: "flex",
                    alignSelf: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#00AF5D",
                      paddingX: "20px",
                      paddingY: "10px",
                      borderRadius: "10px",
                      border: `2px solid #bcc722`,
                      boxShadow: `0px 0px 7px #bcc722`,
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignSelf: "center",
                        width: "30px",
                      }}
                    >
                      {!connectStatus
                        ? <img src={WalletIcon} width={30} height={30} alt="wallet icon" />
                        : <img src={MetaMaskIcon} width={30} height={30} alt="metamask icon" />
                      }
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignSelf: "center",
                      }}
                    >
                      {!connectStatus && (
                          <ButtonUnstyled  onClick={handleConnection} component={ConnectButton}>
                            Connect Wallet
                          </ButtonUnstyled> )
                      }    
                      { connectStatus && netStatus &&  (          
                          <ButtonUnstyled disabled component={ConnectButton}>
                            {walletAddress.substr(0, 5) + "..." + walletAddress.substr(-5)}
                          </ButtonUnstyled> )
                      }
                      { connectStatus && !netStatus && (
                          <ButtonUnstyled onClick={handleConnection} component={ConnectButton}>
                            Wrong Network
                          </ButtonUnstyled> )
                      }
                      <div style={{backgroundColor:"#fff", color:"#000"}}>
                        {netStatus}
                        sdfsdfsdfsdfsd
                      </div>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
      }
    </Box>
  );
};

export default Menu;
