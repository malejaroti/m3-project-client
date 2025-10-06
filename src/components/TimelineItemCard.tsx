import { Delete, Edit } from "@mui/icons-material"
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material"
import { type ITimelineItem } from "../pages/TimelineItemsPage"

type TimelineItemCardProps = {
    timelineItem: ITimelineItem
    callbackOnClickTrash: () => void
    callbackOnClickEdit: () => void
}

function TimelineItemCard({ timelineItem, callbackOnClickTrash, callbackOnClickEdit }: TimelineItemCardProps) {

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const formatted = new Intl.DateTimeFormat('en-GB', {
            weekday: 'short',   // gives Mon, Tue, etc.
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(dateStr));// e.g. "Mon, 07/10/2025"
        
        const [weekdayPart, rest] = formatted.split(',', 2);
        if (!rest) return weekdayPart; // fallback
        const weekdayClean = weekdayPart.replace(/\.$/, ''); // avoid double dots
        return `${weekdayClean}. ${rest.trim()}`;
    }

    return (
        <Card key={timelineItem._id}
            sx={{
                // maxHeight: 480,
                minWidth: 280,
                position: 'relative',
                display: 'flex',
                padding:'20px 15px',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#e2e8f0',
                // justifyContent: 'space-between'
                // justifyContent: 'space-between'
            }}  
        >
            {timelineItem.images.length !== 0 ?
                // <CardMedia
                //     component="img"
                //     image={
                //         timelineItem.images && timelineItem.images.length > 0
                //             ? timelineItem.images[0]
                //             : undefined
                //     }
                //     alt="Timeline image"
                //     sx={{
                //         maxHeight: 250,
                //         // maxWidth:400,
                //         objectFit: 'contain', //contain
                //         // backgroundColor: '#f5f5f5',
                //         padding: '20px 0px',
                //         boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)'
                //     }}
                // />
                <Box
                    component="img"
                    src={
                        timelineItem.images && timelineItem.images.length > 0
                            ? timelineItem.images[0]
                            : undefined
                    }
                    alt="Timeline image"
                    sx={{
                        maxHeight: 150,
                        justifySelf:'flex-start',
                        marginBottom:'10px',
                        // border:2,
                        flexGrow:1,
                        // maxWidth:400,
                        objectFit: 'contain', //contain
                        // backgroundColor: '#f5f5f5',
                        // border: '1px solid black',
                        // padding: '20px 0px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.85)',
                        transform: 'translateZ(0)', /* helps with GPU rendering */
                        // transform: 'rotateY(15deg) rotateX(5deg)',
                        // transformStyle: 'preserve-3d',
                    }}
                >
                </Box>
                : ""
            }
            <CardContent sx={{
                display: 'flex',
                // alignSelf:'flex-end',
                // justifySelf:'flex-end !important',
                // marginTop:'auto',
                // marginTop:'10px',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                padding:'10px',
                backgroundColor: timelineItem.images.length === 0 ? '#f5f5f5' : 'transparent',
                // border:1,
            }} className="">
                <Typography gutterBottom variant="h6" component="div" 
                sx={{ marginBottom: '0px', textAlign: 'center', lineHeight:'1' }}>
                    {timelineItem.title}
                </Typography>
                <Typography variant="body2"
                    sx={{
                        color: 'text.secondary',
                        paddingBottom: '8px',
                    }}>
                    {formatDate(timelineItem.startDate)}
                    {timelineItem.startDate === timelineItem.endDate 
                    ? "" 
                    : timelineItem.endDate
                        ? ` - ${new Intl.DateTimeFormat('en-GB').format(
                            new Date(timelineItem.endDate)
                        )}`
                        : ' - Present'
                    }
                </Typography>
                <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    maxHeight: 100,
                    textAlign: 'justify',
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
                position: 'absolute',
                bottom: '10px',
                // left:'10px'
            }}
                className="">
                <IconButton
                    aria-label="Edit item"
                    onClick={callbackOnClickEdit}
                    // onClick={() => openDrawerEdit(timelineItem, 'right')}
                    size="small"
                    sx={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                        color: '#a7a4a4ff',
                    }}
                >
                    <Edit fontSize="small" />
                </IconButton>
                <IconButton
                    aria-label="Delete item"
                    onClick={callbackOnClickTrash}
                    size="small"
                    sx={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                        color: '#a7a4a4ff',
                    }}
                >
                    <Delete fontSize="small" />
                </IconButton>

            </Box>
        </Card>
    )
}
export default TimelineItemCard