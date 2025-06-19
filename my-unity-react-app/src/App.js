import React, { useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import useConfetti from "./hooks/useConfetti";
import logo from "./logo.svg";
import unityLogo from "./icons8-unity.svg";
import "./App.css";

const UNITY_CONFIG = {
  GAME_OBJECT: "GameController",
  METHODS: {
    ADD_COUNT: "OnClickBadge",
    RESET_COUNT: "OnClickReset",
  },
  EVENTS: {
    UPDATE_COUNT: "UpdateCountInReact",   
    ACHIEVEMENT: "CallReactMethodFromUnity", 
  },
};

function App() {
  const [showUnity, setShowUnity] = useState(false);
  const [message, setMessage] = useState();
  const [toastVisible, setToastVisible] = useState(false);
  const { fireRain, fireBurst } = useConfetti();
  const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);

  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    unload,
    requestFullscreen,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: `${process.env.PUBLIC_URL}/unitybuild/react-unity-webgl.loader.js`,
    dataUrl: `${process.env.PUBLIC_URL}/unitybuild/react-unity-webgl.data`,
    frameworkUrl: `${process.env.PUBLIC_URL}/unitybuild/react-unity-webgl.framework.js`,
    codeUrl: `${process.env.PUBLIC_URL}/unitybuild/react-unity-webgl.wasm`,
  });

  const handleClickFullscreen = async () => {
    if (!isLoaded) return;
    try {
      await requestFullscreen(true);
    } catch (error) {
      console.error("Fullscreen request failed:", error);
    }
  };

  const handleUnloadUnity = async () => {
    if (!isLoaded) return;
    try {
      await unload();
      console.log("Unload success");
      setShowUnity(false);
      setMessage(undefined);
      setToastVisible(false);
    } catch (error) {
      console.error(`Unable to unload: ${error}`);
    }
  };

  const handleLoadUnity = () => {
    setShowUnity(true);
  };

  const AddCount = () => {
    if (!isLoaded) return;
    try {
      sendMessage(UNITY_CONFIG.GAME_OBJECT, UNITY_CONFIG.METHODS.ADD_COUNT);
    } catch (error) {
      console.error("Failed to send AddCount message:", error);
    }
  };

  const ResetCounter = () => {
    if (!isLoaded) return;
    try {
      sendMessage(UNITY_CONFIG.GAME_OBJECT, UNITY_CONFIG.METHODS.RESET_COUNT);
    } catch (error) {
      console.error("Failed to send ResetCounter message:", error);
    }
  };

  useEffect(() => {
    const updateDevicePixelRatio = () => setDevicePixelRatio(window.devicePixelRatio);
    const mediaMatcher = window.matchMedia(`screen and (resolution: ${devicePixelRatio}dppx)`);
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    return () => mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
  }, [devicePixelRatio]);

  useEffect(() => {
    const handleUpdateCount = (event) => {
      setMessage(parseInt(event.detail, 10));
    };

    const handleAchievement = (event) => {
      const countValue = parseInt(event.detail, 10);
      console.log("Achievement unlocked at count:", countValue);
      setMessage(countValue);
      setToastVisible(true);
      fireRain();
      setTimeout(() => {
        fireBurst();
        setToastVisible(false);
      }, 1000);
    };

    window.addEventListener(UNITY_CONFIG.EVENTS.UPDATE_COUNT, handleUpdateCount);
    window.addEventListener(UNITY_CONFIG.EVENTS.ACHIEVEMENT, handleAchievement);

    return () => {
      window.removeEventListener(UNITY_CONFIG.EVENTS.UPDATE_COUNT, handleUpdateCount);
      window.removeEventListener(UNITY_CONFIG.EVENTS.ACHIEVEMENT, handleAchievement);
    };
  }, [addEventListener, removeEventListener, fireRain, fireBurst]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} className="react-logo" alt="react-logo" />
          <img src={unityLogo} className="unity-logo" alt="unity-logo" />
        </div>
        <p>Unity WebGL in React Website</p>
      </header>

      {!showUnity && (
        <button className="loadUnityBtn" onClick={handleLoadUnity}>
          Load Unity Scene
        </button>
      )}

      {showUnity && toastVisible && (
        <div className="achievement-toast">
          <p className="achievement-text">
            Achievement Unlocked! You have clicked {message} times.
          </p>
        </div>
      )}

      {showUnity && <div className="count">{message}</div>}

      {showUnity && (
        <div className="UnitySection">
          {!isLoaded && (
            <div className="UnityLoadingContainer">
              <p className="UnityLoadingText">
                Loading Unity Application... {Math.round(loadingProgression * 100)}%
              </p>
              <div className="UnityProgressBarContainer">
                <div
                  className="UnityProgressBar"
                  style={{ width: `${loadingProgression * 100}%` }}
                />
              </div>
            </div>
          )}
          <Unity
            unityProvider={unityProvider}
            className={`UnityCanvas ${isLoaded ? "loaded" : "loading"}`}
            style={{
              width: "1080px",
              maxWidth: "1080px",
              height: "auto",
              maxHeight : "720px",
              visibility: isLoaded ? "visible" : "hidden",
            }}
            devicePixelRatio={devicePixelRatio}
          />
        </div>
      )}

      {isLoaded && showUnity && (
        <div className="button-container">
          <button className="button" onClick={handleClickFullscreen}>
            Fullscreen
          </button>
          <button className="button" onClick={AddCount}>
            Add Count
          </button>
          <button className="button" onClick={ResetCounter}>
            Reset Counter
          </button>
          <button className="button" onClick={handleUnloadUnity}>
            Unload Scene
          </button>
        </div>
      )}
    </div>
  );
}

export default App;