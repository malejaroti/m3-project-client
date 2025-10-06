import Box from "@mui/material/Box";
import { styled } from "@mui/system";

// "flex flex-wrap justify-center gap-20 mt-10 lg:flex-row sm:flex-col"
export const TimelinesCardsContainer = styled(Box)(() => ({
    display: "flex",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    // rowGap:'50px',
    justifyContent: "center",
    // gap:'50px',
    columnGap: '50px',
    rowGap: '50px',
    marginTop: "40px", // mt-10 = 2.5rem = 40px
    flexDirection: "row",
    width: "100%"

    // "@media (max-width: 1024px)": {
    //     flexDirection: "column",
    // },
}))

// flex justify-left gap-20 mt-10 lg:flex-row sm:flex-col max-h-[600px] overflow-x-scroll max-w-screen
export const TimelineItemsCardsContainer = styled(Box)(() => ({
    display: "flex",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    // rowGap:'50px',
    justifyContent: "center",
    // gap:'50px',
    columnGap: '100px',
    rowGap: '50px',
    marginTop: "40px", // mt-10 = 2.5rem = 40px
    flexDirection: "row",
    width: "100%"

    // "@media (max-width: 1024px)": {
    //     flexDirection: "column",
    // },
}))