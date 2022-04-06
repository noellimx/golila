import * as Cookies from "js-cookie";
import { NO_OP } from "./components/helpers.js";
const cookier = Cookies.default;

const ClientUser = (io) => {
  return ((Cookies) => {
    const whatIsMyName = () => {
      return new Promise((resolve) => {
        io.emit("my-name-please", resolve);
      });
    };

    const howYellowAmI = () => {
      return new Promise((resolve) => {
        io.emit("my-banana-count-please", resolve);
      });
    };

    const onMoreBanana = (chanRecv) => {
      io.on("my-banana-count-please", chanRecv);
    };

    return {
      whatIsMyName,
      howYellowAmI,
      onMoreBanana,
    };
  })(cookier);
};

export default ClientUser;
