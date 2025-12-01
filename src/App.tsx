import { useEffect, useState } from "react";
import type { Prize } from "./types";
import {
  storage,
  STORAGE_KEY,
  TITLE_KEY,
  CENTER_IMAGE_KEY,
  PASSWORD_KEY,
  CUSTOM_COLORS_KEY,
} from "./storage";
import { PrizeSetupScreen } from "./components/PrizeSetupScreen";
import { PrizeWheelScreen } from "./components/PrizeWheelScreen";

type Screen = "wheel" | "setup";

export function App() {
  const [screen, setScreen] = useState<Screen>("wheel");

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [wheelTitle, setWheelTitle] = useState("Колело на наградите");
  const [centerImageData, setCenterImageData] = useState<string | null>(null);
  const [settingsPassword, setSettingsPassword] = useState<string>("");
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const [
        rawPrizes,
        storedTitle,
        centerImageRaw,
        storedPassword,
        rawCustomColors,
      ] = await Promise.all([
        storage.getItem(STORAGE_KEY),
        storage.getItem(TITLE_KEY),
        storage.getItem(CENTER_IMAGE_KEY),
        storage.getItem(PASSWORD_KEY),
        storage.getItem(CUSTOM_COLORS_KEY),
      ]);

      if (rawPrizes) {
        try {
          setPrizes(JSON.parse(rawPrizes));
        } catch {
          setPrizes([]);
        }
      }
      if (storedTitle && storedTitle.trim().length > 0) {
        setWheelTitle(storedTitle);
      }
      if (centerImageRaw) {
        setCenterImageData(centerImageRaw);
      }
      if (storedPassword) {
        setSettingsPassword(storedPassword);
      }
      if (rawCustomColors) {
        try {
          setCustomColors(JSON.parse(rawCustomColors));
        } catch {
          setCustomColors([]);
        }
      }

      setInitialized(true);
    })();
  }, []);

  const updatePrizes = async (next: Prize[]) => {
    setPrizes(next);
    await storage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateTitle = async (title: string) => {
    setWheelTitle(title);
    await storage.setItem(TITLE_KEY, title);
  };

  const updateCenterImage = async (data: string | null) => {
    setCenterImageData(data);
    if (data) {
      await storage.setItem(CENTER_IMAGE_KEY, data);
    } else {
      await storage.removeItem(CENTER_IMAGE_KEY);
    }
  };

  const updatePassword = async (pwd: string) => {
    setSettingsPassword(pwd);
    await storage.setItem(PASSWORD_KEY, pwd);
  };

  const updateCustomColors = async (colors: string[]) => {
    setCustomColors(colors);
    await storage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(colors));
  };

  if (!initialized) {
    return <div style={{ padding: 20 }}>Зареждане…</div>;
  }

  return (
    <div
      className="app-root"
      style={{
        minHeight: "100vh",
        background: "#ffffff", // бяло
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        padding: "12px 8px",
      }}
    >
      {screen === "setup" ? (
        <PrizeSetupScreen
          prizes={prizes}
          onPrizesChange={updatePrizes}
          wheelTitle={wheelTitle}
          onWheelTitleChange={updateTitle}
          centerImageData={centerImageData}
          onCenterImageChange={updateCenterImage}
          settingsPassword={settingsPassword}
          onSettingsPasswordChange={updatePassword}
          customColors={customColors}
          onCustomColorsChange={updateCustomColors}
          onGoToWheel={() => setScreen("wheel")}
        />
      ) : (
        <PrizeWheelScreen
          prizes={prizes}
          onPrizesChange={updatePrizes}
          wheelTitle={wheelTitle}
          centerImageData={centerImageData}
          settingsPassword={settingsPassword}
          onGoToSetup={() => setScreen("setup")}
        />
      )}
    </div>
  );
}

export default App;
