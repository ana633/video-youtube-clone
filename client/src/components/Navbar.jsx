import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Upload from "./Upload";
import { editUser, logout } from "../redux/userSlice";
import app from "../firebase";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const ContainerEdit = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrapperEdit = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const CloseEdit = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const InputEdit = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;
const ButtonEdit = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const LabelEdit = styled.label`
  font-size: 14px;
`;

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;


const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [q, setQ] = useState("");
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [inputs, setInputs] = useState({});

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if(urlType === "img")  setImgPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    img && uploadFile(img, "img");
  }, [img]);

  const handleUpload = async (e)=>{
    e.preventDefault();
    await axios.put(`/api/users/${currentUser._id}`, {...inputs});
    dispatch(editUser(inputs.img));
  }


  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };


  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e) => setQ(e.target.value)}/>
          <SearchOutlinedIcon onClick={() =>navigate(`/search?q=${q}`) } />
        </Search>
        { currentUser ? (
          <>
          <User>
            <VideoCallOutlinedIcon style={{cursor: 'pointer'}} onClick={() => setOpen(true)}/>
            <Avatar src={currentUser.img} style={{cursor: 'pointer'}} onClick={() =>  setEdit(true)}/>
            {currentUser.name}
          </User>
            <LogoutIcon  style={{color: 'white', marginLeft: '1rem', fontSize: '18px', cursor: 'pointer'}} onClick={handleLogout}/>
          </>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
      </Wrapper>
    </Container>
    { open && <Upload setOpen={setOpen}/>}
    { edit && <ContainerEdit>
      <WrapperEdit>
        <CloseEdit onClick={() => {setEdit(false);  window.location.reload(false);}}>X</CloseEdit>
        <LabelEdit>Edit Profile Image:</LabelEdit>
        {imgPerc > 0 ? (
          "Uploading:" + imgPerc + "%"
        ) : (
          <InputEdit
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <ButtonEdit onClick={handleUpload}>Save Changes</ButtonEdit>
      </WrapperEdit>
    </ContainerEdit>}
    </>
  );
};

export default Navbar;
