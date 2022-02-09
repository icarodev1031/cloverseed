import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import ProgresModal from "../Modals/ProgresModal";
import WinModal from "../Modals/WinModal";
import CLOVERFIELD from "../../static/images/FIELD_NFT.jpg";
import CLOVERYARD from "../../static/images/YARD_NFT.jpg";
// import CLOVERFIELD from "../../static/images/GIF CLOVERFIELD.gif";
// import CLOVERYARD from "../../static/images/GIF CLOVERYARD.gif";
import CLOVERPOT from "../../static/images/GIF CLOVERPOT.gif";
import { getContract, } from "../../functions/Setup";
import CLOVER_SEEDS_TOKEN from "../../const/abis/clover_seeds_token_abi.json";
import CLOVER_SEEDS_NFT from "../../const/abis/clover_seeds_nft_abi.json";
import CLOVER_SEEDS_CONTROLLER from "../../const/abis/clover_seeds_controller_abi.json";
import CLOVER_SEEDS_STAKE from "../../const/abis/clover_seeds_stake_abi.json";

const Title = styled("h1")({
  fontFamily: `Maven Pro, sans-serif`,
  fontStyle: `normal`,
  fontWeight: `700`,
  fontSize: `18px`,
  lineHeight: `24px`,
  textAlign: "center",
  textTransform: "uppercase",
  paddingBottom: "10px",
  color: `#FFFFFF`,
});

const data = [
  {
    picture: CLOVERFIELD,
    title: "Seed$ daily rewards",
    buttonText: "Mint Cloverfield",
    price: "10,000",
    color: "#c1d117",
    percentA: "4",
    percentB: "5",
    percentC: "6",
    percentD: "15",
  },
  {
    picture: CLOVERYARD,
    title: "Seed$ daily rewards",
    buttonText: "Mint Cloveryard",
    price: "1,000",
    color: "#00a65a",
    percentA: "2",
    percentB: "2.5",
    percentC: "3",
    percentD: "6",
  },
  {
    picture: CLOVERPOT,
    title: "Seed$ daily rewards",
    buttonText: "Mint CLOVERPOT",
    price: "100",
    color: "#3c6f66",
    percentA: "1",
    percentB: "1.5",
    percentC: "2",
    percentD: "4",
  },
];

const Cards = () => {

  const {seeds_token, seeds_stake, seeds_nft, seeds_controller, BigNumber} = window
  console.log("seeds_token", seeds_token)
  const connectStatus = useSelector((state) => state.isWalletConnect);
  const coinbase = useSelector((state) => state.coinbaseAddress);
  // Progress Modal Handlers
  const [openProgressModal, setOpen] = useState(false);
  // WinModal Modal Handlers
  const [openWinModal, setopenWinModal] = useState(false);
  const [fieldRewardRate, setFieldRewardRate] = useState(4);
  const [yardRewardRate, setYardRewardRate] = useState(2);
  const [ isApproved, setIsApproved ]= useState(localStorage.getItem("isApproved"))
  const [ depositedAmount, setDepositedAmount ] = useState('')
  const [ withdrawAmount, setWithdrawAmount ] = useState('')
  const [ fetchData, setState ] = useState({
    apr: 0,
    seedsBalance: '',
    pendingDivs: '',
    totalEarnedTokens: '',
    cliffTime: '',
    stakingTime: '',
    depositedTokens: '',
    lastClaimedTime: '',
    stakers: '',
    totalStaked: ''
  })

  useEffect(() => {
    if (connectStatus && coinbase) {
    } else {
      setState({
        apr: 0,
        seedsBalance: '',
        pendingDivs: '',
        totalEarnedTokens: '',
        cliffTime: '',
        stakingTime: '',
        depositedTokens: '',
        lastClaimedTime: '',
        stakers: '',
        totalStaked: '',
      })
    }
  }, [connectStatus, coinbase])

  const handleApproveSeeds = async () => {
    if (connectStatus) {
      const tx = await seeds_token.approve(CLOVER_SEEDS_STAKE.contractAddress, new BigNumber(1000000000).times(1e18).toFixed(0))
      if (tx?.status == 1) {
        localStorage.setItem("isApproved", 1)
      }
      setIsApproved(localStorage.getItem("isApproved"))
    }
  }

  const handleDeposit = async (e) => {
    e?.preventDefault()
    if(connectStatus && isApproved == 1){   
      let amount = depositedAmount
      amount = new BigNumber(amount).times(1e18).toFixed(0)
      const tx = await seeds_stake.deposit(amount)
      if (tx?.status == 1) {
        alertify.success(String('Transaction to stake Succeed!'))
      } else {
        throw new Error("User denied transaction signature.!")
      }
    }    
  }

  const getRewardRate = (value, buttonText) => {
    if (buttonText.includes("Cloverfield")) {
      setFieldRewardRate(parseFloat(value));
      setYardRewardRate(2);
    } else if (buttonText.includes("Cloveryard")) {
      setYardRewardRate(parseFloat(value));
      setFieldRewardRate(4);
    }
  };
  const handleNFTMint = async (type) => {
    if (connectStatus && type) {
      handleProgressModal();
      try {
        if (type.includes("Cloverfield")) {
          const tx = await seeds_token.balanceOf(coinbase)
          console.log("tx", tx)
          // const tx = await seeds_controller.buyCloverFiled()
          if (tx?.status == 1) {
            alertify.success(String('Transaction to mint Succeed!'))
            setTimeout(progressCloseModal, 3000);
          } else {
            setTimeout(setOpen(false), 300000);
            alertify.error(String('User denied transaction signature.!'))
          }
        } else if (type.includes("Cloveryard")) {
          const tx = await seeds_controller.buyCloverYard()
          // const tx = await seeds_controller.buyCloverYard()
          if (tx?.status == 1) {
            alertify.success(String('Transaction to mint Succeed!'))
            setTimeout(progressCloseModal, 3000);
          } else {
            setOpen(false);
            alertify.error(String('User denied transaction signature.!'))
          }
        }
      } catch (e) {
        setTimeout(setOpen(false), 300000);
        alertify.error(String(e))
      }
      
    }
  };
  const handleProgressModal = () => {
    setOpen(true);
  };
  const progressCloseModal = () => {
    setOpen(false);
    handleClickWinModal();
  };
 
  const handleClickWinModal = () => {
    setopenWinModal(true);
  };

  const handleCloseWinModal = () => {
    setopenWinModal(false);
  };

  const PercentageButton = ({ color, percent, buttonText }) => {
    return (
      <a
        onClick={(e) => getRewardRate(e.target.text, buttonText)}
        style={{
          backgroundColor: color,
          padding: "4px 10px",
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "5px",
          margin: "0 4px",
          cursor: "pointer"
        }}
      >
        {percent}%
      </a>
    );
  };
  
  const Button = ({ color, title }) => {
    return (
      <a
        onClick={(e) => handleNFTMint(e.target.text)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "55px",
          color: color,
          border: `3px solid ${color}`,
          boxShadow: `0px 0px 18px ${color}`,
          borderRadius: "6px",
          fontSize: "20px",
          cursor: "pointer",
          textTransform: "uppercase",
          fontWeight: "700",
          fontFamily: `Maven Pro, sans-serif`,
          textDecoration: "none",
        }}
      >
        {title}
      </a>
    );
  };

  return (
    <Box
      sx={{
        paddingY: "40px",
      }}
    >
      <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 5, md: 20 }}>
        {data.map((item, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  border: `3px solid ${item.color}`,
                  boxShadow: `0px 0px 16px ${item.color}`,
                  padding: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: "120px",
                    height: "120px",
                    marginX: "auto",
                    marginBottom: "20px",
                  }}
                >
                  <img src={item.picture} alt="" />
                </Box>
                <Box>
                  <Title>{item.title} </Title>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "40px",
                  }}
                >
                  <PercentageButton
                    buttonText={item.buttonText}
                    color={item.color}
                    percent={item.percentA}
                  />
                  <PercentageButton
                    buttonText={item.buttonText}
                    color={item.color}
                    percent={item.percentB}
                  />
                  <PercentageButton
                    buttonText={item.buttonText}
                    color={item.color}
                    percent={item.percentC}
                  />
                  <PercentageButton
                    buttonText={item.buttonText}
                    color={item.color}
                    percent={item.percentD}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    title={item.buttonText}
                    color={item.color}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontFamily: `Maven Pro, sans-serif`,
                    fontStyle: `normal`,
                    fontWeight: `700`,
                    fontSize: `18px`,
                    lineHeight: `24px`,
                    textAlign: "center",
                    textTransform: "uppercase",
                    paddingTop: "20px",
                    color: `#FFFFFF`,
                  }}
                >
                  {item.price} SEED$
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <ProgresModal
        openProgressModal={openProgressModal}
        progressCloseModal={progressCloseModal}
      />
      <WinModal
        openWinModal={openWinModal}
        handleCloseWinModal={handleCloseWinModal}
      />
    </Box>
  );
};

export default Cards;
