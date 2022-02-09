import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import WalletIcon from "../../static/images/Picto-wallet.svg";
import MetaMaskIcon from "../../static/images/metamask.svg";
import Logo from "../../static/images/Anim.-Logo-Header-+-Footer-CS.gif";

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

const MobileMenu = (props) => {
  const [state, setState] = React.useState({
    left: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 300, backgroundColor: "#0d1f19", height: "100%" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 200,
          paddingY: "50px",
          paddingX: "30px"
        }}
      >
        <Link to="/">
          <img src={Logo} width={250} height={28} alt="" />
        </Link>
      </Box>
      <Box
        sx={{
          display: "block",
          marginY: "20px",
          marginX: "10px",
          alignSelf: "center", justifyContent: "center",
        }}
      >
        <Link to="/">
          <Box
            sx={{
              color: "#fff",
              fontSize: "22px",
              lineHeight: `42px`,
              textTransform: "uppercase",
              fontFamily: "Azonix",
              borderRadius: "6px",
              textAlign: "center",
              border: `2px solid #00B951`,
              cursor: "pointer",
            }}
          >
            HOME
          </Box>
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignSelf: "center",
          marginX: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            backgroundColor: "#00AF5D",
            borderRadius: "10px",
            width: "100%",
            border: `2px solid #bcc722`,
            boxShadow: `0px 0px 7px #bcc722`,
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignSelf: "center",
              width: "25px",
            }}
          >
            {!props.connectStatus
              ? <img src={WalletIcon} width={25} height={25} alt="wallet icon" />
              : <img src={MetaMaskIcon} width={25} height={25} alt="metamask icon" />
            }
          </Box>
          <Box
            sx={{
              display: "flex",
              alignSelf: "center",
            }}
          >
            {!props.connectStatus
              ? <ButtonUnstyled  onClick={props.handleConnection} component={ConnectButton}>
                  Connect Wallet
                </ButtonUnstyled>
              : <ButtonUnstyled disabled component={ConnectButton}>
                  {props.walletAddress.substr(0, 5) + "..." + props.walletAddress.substr(-5)}
                </ButtonUnstyled>
            }
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <div>
      <div>
        <React.Fragment>
          <Box
            sx={{
              display: "flex",
              justifyContent: " space-between",
              paddingY: "32px",
              paddingX: "15px",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "250px",
              }}
            >
              <Link to="/">
                <img src={Logo} width={250} height={28} alt="" />
              </Link>
            </Box>
            <Box
              onClick={toggleDrawer("left", true)}
              sx={{
                display: "flex",
                alignSelf: "center",
                cursor: "pointer",
              }}
            >
              <MenuIcon
                sx={{
                  width: "30px",
                  height: "30px",
                  color: "#FFFFFF",
                }}
              />
            </Box>
          </Box>
          <SwipeableDrawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
          >
            {list("left")}
          </SwipeableDrawer>
        </React.Fragment>
      </div>
    </div>
  );
};

export default MobileMenu;
