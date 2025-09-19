import Box from "@mui/material/Box";
import { styled } from "@mui/system";

// "flex flex-wrap justify-center gap-20 mt-10 lg:flex-row sm:flex-col"
export const CardsContainer = styled(Box)(() => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "left",
    gap: "50px",
    marginTop: "40px", // mt-10 = 2.5rem = 40px
    flexDirection: "row",

    // "@media (max-width: 1024px)": {
    //     flexDirection: "column",
    // },
}))