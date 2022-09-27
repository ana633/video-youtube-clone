import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";

const Container = styled.div``;

const Button = styled.button`
  padding: 5px;
  background-color: ${({ theme }) => theme.bg};
  color: white;
  font-weight: 500;
  // margin-top: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 20px;
  opacity: 60%;
  gap: 5px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 70%;
`;

const Comments = ({videoId}) => {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    console.log(input,videoId);
    try {
      await axios.post("/api/comments", {"desc":input, "videoId":videoId });
      window.location.reload();
    }catch(error){
      
    }
    setShowButton(false);
  };

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img}/>
        {
          showButton ? (
            <>
            <Input 
            placeholder="Add a comment..." 
            onMouseEnter={() =>setShowButton(true)}
            onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleAddComment}>Comment</Button>
            <Button onClick={() => {setInput(""); setShowButton(false);}}>Cancel</Button>
            </>
          ) : (
            <Input 
            placeholder="Add a comment..." 
            onMouseEnter={() =>setShowButton(true)}
            />
            
          )
        }
      </NewComment>
      {
        comments.map(comment => (
          <Comment key={comment._id} comment={comment}/>
        ))
      }
    </Container>
  );
};

export default Comments;
