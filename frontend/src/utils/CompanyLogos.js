import amazonLogo from "../assets/amazon.png";
import googleLogo from "../assets/google.png";
import infosysLogo from "../assets/infosys.png";
import microsoftLogo from "../assets/microsoft.png";
import tcsLogo from "../assets/tcs.png";
import accentureLogo from "../assets/accenture.png";
import wiproLogo from "../assets/wipro.png";

const logoMap = {
  amazon: amazonLogo,
  google: googleLogo,
  infosys: infosysLogo,
  microsoft: microsoftLogo,
  tcs: tcsLogo,
  accenture: accentureLogo,
  wipro: wiproLogo,
};

export const CompanyLogos = (companyName = "") => {
  const raw = companyName.toLowerCase();

  const matchedKey = Object.keys(logoMap).find(key =>
    raw.includes(key)
  );

  return matchedKey
    ? logoMap[matchedKey]
    : `https://ui-avatars.com/api/?name=${companyName}`;
};