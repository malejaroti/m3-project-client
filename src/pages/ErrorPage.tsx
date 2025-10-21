import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import SentimentVeryDissatisfied from "@mui/icons-material/SentimentVeryDissatisfied"
import { useNavigate } from "react-router"


function ErrorPage() {
    const navigate = useNavigate()
    return (
        <>
        
            <div className='h-[70%] m-auto flex flex-col items-center p-5 text-center'>
            <SentimentVeryDissatisfied sx={{ 
                fontSize:{xs:150, lg:300}, color: 'gray', mb: 2 }}/>
            <Typography variant="h3" >Oops!</Typography>
            <Typography variant="h5" color="gray">Sorry</Typography>
            <Typography variant="body1" sx={{mt:3, color:'gray'}}>There was an error in our server.</Typography>
            
            <Button  variant='contained' size="small" sx={{mt:3}} onClick={()=>{navigate("/")}} >
                Go back Home
            </Button>
            </div>
        </>
    )
}
export default ErrorPage