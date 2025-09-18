import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import WrongLocation from "@mui/icons-material/WrongLocation"
import { useNavigate } from "react-router"


function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <>
        
            <div className='h-[70%] m-auto flex flex-col items-center p-5 text-center'>
            <WrongLocation sx={{ 
                fontSize:{xs:150, lg:300}, color: 'gray', mb: 2 }}/>
            <Typography variant="h3" >404</Typography>
            <Typography variant="h5" color="gray">Page not found</Typography>
            <Typography variant="body1" sx={{mt:3, color:'gray'}}>The page that you are looking for doesn't exist.</Typography>
            
            <Button  variant='contained' size="small" sx={{mt:3}} onClick={()=>{navigate("/")}} >
                Go back Home
            </Button>
            </div>
        </>
    )
}
export default NotFoundPage