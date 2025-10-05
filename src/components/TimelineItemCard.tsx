import { Delete, Edit } from "@mui/icons-material"
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material"
import { type ITimelineItem } from "../pages/TimelineItemsPage"

type TimelineItemCardProps = {
    timelineItem :  ITimelineItem
    callbackOnClickTrash : () => void
    callbackOnClickEdit : () => void
}
function TimelineItemCard( {timelineItem, callbackOnClickTrash, callbackOnClickEdit}: TimelineItemCardProps) {
  return (
    <Card sx={{ 
    maxHeight: 480, 
    minWidth:400, 
    position:'relative', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems:'center', 
    backgroundColor: '#e2e8f0',
    justifyContent:'center' 
    }} key={timelineItem._id} className='p-5'>
    {timelineItem.images.length !== 0 ?
        <CardMedia
        component="img"
        image={
            timelineItem.images && timelineItem.images.length > 0
            ? timelineItem.images[0]
            : undefined
        }
        alt="Timeline image"
        sx={{
            maxHeight: 250,
            // maxWidth:400,
            objectFit: 'contain', //contain
            backgroundColor: '#f5f5f5',
            padding: '2px 10px'
        }}
        />
        : ""
    }
    <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems:'center',
        width:'100%',
        backgroundColor: timelineItem.images.length === 0 ? '#f5f5f5' : 'transparent'
    }} className="">
        <Typography gutterBottom variant="h5" component="div" sx={{marginBottom:'0px', textAlign:'center'}}>
        {timelineItem.title}
        </Typography>
        <Typography variant="body1"
        sx={{
            color: 'text.secondary',
            paddingBottom: '8px',
        }}>
        {`${new Intl.DateTimeFormat('en-GB').format(
            new Date(timelineItem.startDate)
        )}`}
        {timelineItem.startDate === timelineItem.endDate ? "" :
            timelineItem.endDate
            ? ` - ${new Intl.DateTimeFormat('en-GB').format(
                new Date(timelineItem.endDate)
            )}`
            : ' - Present'}
        </Typography>
        <Typography variant="body2" sx={{
        color: 'text.secondary',
        maxHeight: 100,
        textAlign:'justify',
        // border:1,
        // display: '-webkit-box',
        // WebkitLineClamp: 2,
        // WebkitBoxOrient: 'vertical',
        // // overflowY: 'scroll',
        overflow: 'hidden',
        // textOverflow: 'ellipsis'
        }}>
        {timelineItem.description}
        </Typography>
    </CardContent>
        <Box sx={{
        display: 'flex',
        // marginTop: 'auto',
        alignSelf: 'flex-end',
        position:'absolute',
        bottom:'10px',
        // left:'10px'
        }}
        className="">
        <IconButton
            aria-label="Edit item"
            onClick={() => callbackOnClickEdit}
            // onClick={() => openDrawerEdit(timelineItem, 'right')}
            size="small"
            sx={{
            alignSelf: 'flex-end',
            justifySelf: 'flex-end',
            color:'#a7a4a4ff',
            }}
        >
            <Edit fontSize="small" />
        </IconButton>
        <IconButton
            aria-label="Delete item"
            onClick={() => callbackOnClickTrash}
            size="small"
            sx={{
            alignSelf: 'flex-end',
            justifySelf: 'flex-end',
            color:'#a7a4a4ff',
            }}
        >
            <Delete fontSize="small" />
        </IconButton>

        </Box>
    </Card>
  )
}
export default TimelineItemCard