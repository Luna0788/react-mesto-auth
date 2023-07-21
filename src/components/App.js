import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import React from "react";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import * as auth from "../utils/auth.js"
import InfoTooltip from "./InfoTooltip";


function App() {
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    
  }
  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard();
    setIsInfoTooltipOpen(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(
        (err) => {
          console.log(err);
      }
      );
  }

  function handleCardDelete(card) {
    api
    .deleteCard(card._id)
    .then(() => {
      setCards((cards) => cards.filter((c) => c._id !== card._id));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateUser({ name, about}) {
    api
      .patchUserInfo({ name, about})
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .patchAvatar({ avatar })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
    .postNewCard({
      name, link
    })
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleRegister (email, password) {
    auth.register(email, password)
        .then((data) => {
          setIsRegisterSuccsess(true);
          setIsInfoTooltipOpen(true);
          navigate("/sign-in", {replace: true});
        })
        .catch((err) => {
          setIsRegisterSuccsess(false);
          setIsInfoTooltipOpen(true);
          console.log(err);
        });
  }

  function handleLogin (email, password) {
    auth.authorize(email, password)
        .then((data) => {
          if (data.token) {
            localStorage.setItem('jwt', data.token);
            setIsLoggedIn(true);
            setUserEmail(email);
            navigate("/", {replace: true});
          }
          else return;
        })
        .catch((err) => {
          setIsRegisterSuccsess(false); //что-то пошло не так
          setIsInfoTooltipOpen(true);
          console.log(err);
        })
  }

  function handleTokenCheck() {
    if (localStorage.getItem("jwt")){
      const token = localStorage.getItem("jwt");
      auth.checkToken(token)
          .then((res) => {
            if (res) {
              setIsLoggedIn(true);
              setUserEmail(res.data.email);
              navigate("/", {replace: true});
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isRegisterSuccsess, setIsRegisterSuccsess] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState();
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    handleTokenCheck();
  }, [])

  React.useEffect(() => {
        api
            .getInitialCards()
            .then((initialCards) => {
                setCards(initialCards);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

  React.useEffect(() => {
    api
        .getUserInfo()
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((err) => {
            console.log(err);
        });
  },[]);


  return (
    
  <div>
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        userEmail={ userEmail }
        onSignOut={ handleSignOut }
      />
      <Routes>
        <Route path="/" element={ 
          <ProtectedRouteElement 
            element={Main}
            isLoggedIn={isLoggedIn}
            onEditProfile = { handleEditProfileClick }
            onAddPlace = { handleAddPlaceClick }
            onEditAvatar = { handleEditAvatarClick }
            onCardClick={ handleCardClick }
            onCardLike={ handleCardLike }
            onCardDelete={handleCardDelete}
            cards={ cards }
          />
        } />

        <Route path="*" element={ isLoggedIn ? <Navigate to="/" replace/> : <Navigate to="/sign-in" replace /> } />

        <Route path="/sign-in" element={
          <Login 
            onLogin={ handleLogin }
          />
        } />

        <Route path="/sign-up" element={
          <Register 
            onRegister={ handleRegister }
          />
        } />

      </Routes>
      
      <Footer/>

      <EditProfilePopup 
        isOpen={ isEditProfilePopupOpen }
        onClose={ closeAllPopups }
        onUpdateUser={ handleUpdateUser }
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} 
        onAddPlace={handleAddPlaceSubmit}
       />

      <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} 
        onUpdateAvatar={handleUpdateAvatar}
        />

      <PopupWithForm
        title = {'Вы уверены?'}
        name = {'confirmation'}
        buttonText = {'Да'}
        isOpen={ false }
        onClose={ closeAllPopups }
      />    

      <ImagePopup
        card={ selectedCard }
        onClose={ closeAllPopups }
      />

      <InfoTooltip 
        isOpen={ isInfoTooltipOpen }
        onClose={ closeAllPopups }
        isSuccess={ isRegisterSuccsess }
      />
    </CurrentUserContext.Provider>
  </div>
  
  );
}

export default App;
