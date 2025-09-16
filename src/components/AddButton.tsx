import Button from "@mui/material/Button"

interface AddButtonProps {
    handleOnClick: () => void;
    buttonLabel: string
}

function AddButton({ handleOnClick, buttonLabel}: AddButtonProps) {
    return (
        <Button
            variant="contained"
            // size='large'
            sx={{
                fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 1 },
                position: 'absolute',
                top: 0, 
                right: 0,
                bgcolor: 'primary.main', // use theme's color
                '&:hover': {
                    bgcolor: 'primary.dark',
                },
            }}
            // onClick={() => openDrawerCreate('right')}
            onClick={handleOnClick}
        >
            {buttonLabel}
        </Button>
    )
}
export default AddButton