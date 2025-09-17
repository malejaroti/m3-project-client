import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"

type DeleteModalProps = {
    modalState: boolean,
    // modalStateSetter: () => void
    modalStateSetter: (value: boolean) => void
    handleDelete: () => void
}

const styleModalBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function DeleteModal({ modalState, modalStateSetter, handleDelete }: DeleteModalProps) {
    const handleClose = () => {
        modalStateSetter(false);
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalState}
            onClose={handleClose}
            closeAfterTransition
            disableRestoreFocus
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={modalState}>
                <Box sx={styleModalBox} className='flex flex-col gap-5'>
                    <div>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Are you sure?
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Are you sure you want to delete this item?
                            This action cannot be undone.
                        </Typography>
                    </div>

                    <div className='flex gap-10 '>
                        <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                        <Button variant='contained' onClick={handleDelete}>Delete</Button>
                    </div>
                    {/* <Box>
                <Button>Cancel</Button>
                <Button>Delete</Button>
                </Box> */}
                </Box>
            </Fade>
        </Modal>
    )
}
export default DeleteModal