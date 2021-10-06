import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  ImageContainer,
  DurationContainer,
  StyledCardHeader,
  VideoTitle,
} from '../Videos/VideoCard'
import { MoreButton } from '../Videos/MoreButton'
import { ChannelDetails, DotSeparator } from '../Videos/ChannelDetails'
import he from 'he'
import { request } from '../utils/api'
import moment from 'moment'
import numeral from 'numeral'
import {
  TWO_COL_MIN_WIDTH,
  useIsMobileView,
  getFormattedDurationString,
  queryChannelAvatar,
} from '../utils/utils'
import { Typography, Avatar } from '@material-ui/core'

const ResultsVideoCard = ({ video }) => {
  const isMobileView = useIsMobileView()

  const {
    id: { kind, videoId },
    snippet: {
      channelId,
      channelTitle,
      title,
      publishedAt,
      thumbnails,
      description,
    },
  } = video

  const thumbnailImage = thumbnails.medium.url

  const [viewCount, setViewCount] = useState(null)
  const [duration, setDuration] = useState(null)
  const [channelAvatar, setChannelAvatar] = useState(null)

  // this is unique to searchResults, because popular videos no need to get more details from 'contentDetails,statistics'
  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        const {
          data: { items },
        } = await request('/videos', {
          params: {
            part: 'contentDetails,statistics',
            id: videoId,
          },
        })
        setDuration(items[0].contentDetails.duration)
        setViewCount(items[0].statistics.viewCount)

        // temp localStorage snippet
        localStorage.setItem(
          `${videoId}_duration`,
          JSON.stringify(items[0].contentDetails.duration)
        )
        localStorage.setItem(
          `${videoId}_viewCount`,
          JSON.stringify(items[0].statistics.viewCount)
        )
      } catch (error) {
        console.log(error)
      }
    }

    // temp if...else and localStorage snippet
    const storedDuration = JSON.parse(
      localStorage.getItem(`${videoId}_duration`)
    )
    const storedViewCount = JSON.parse(
      localStorage.getItem(`${videoId}_viewCount`)
    )

    if (storedDuration && storedViewCount) {
      setDuration(storedDuration)
      setViewCount(storedViewCount)
    } else {
      getVideoDetails()
    }
  }, [videoId])

  // to get channelAvatar
  useEffect(() => {
    // localStorage, to be deleted when finished.
    const storedChannelAvatar = JSON.parse(
      localStorage.getItem(`${videoId}_channelAvatar`)
    )

    if (storedChannelAvatar) {
      // console.log(storedChannelAvatar)
      setChannelAvatar(storedChannelAvatar)
      // console.log('using local stored channelAvatar')
    } else {
      // no need videoId if not using localStorage
      queryChannelAvatar(setChannelAvatar, channelId, videoId)
    }
  }, [channelId])

  const formattedDuration = getFormattedDurationString(duration)

  return (
    <StyledCard>
      <StyledImageContainer>
        <StyledImg src={thumbnailImage} />
        <DurationContainer variant="body2">
          {formattedDuration}
        </DurationContainer>
      </StyledImageContainer>

      {isMobileView ? (
        // Mobile view can make sure of CardHeader from MUI
        <SearchCardHeader
          action={<MoreButton isSearchPage={true} />}
          title={
            <SearchVideoTitle variant="h4">{he.decode(title)}</SearchVideoTitle>
          }
          subheader={
            <ChannelDetails
              {...{ channelTitle, publishedAt, viewCount, isSearchPage: true }}
            />
          }
        />
      ) : (
        // desktop view can't use MUI CardHeader because position of elements inside CardHeader can't be changed.
        <ContentContainer>
          <VideoContentTop>
            <SearchVideoTitle variant="h3">{he.decode(title)}</SearchVideoTitle>
            <MoreButton isSearchPage={true} />
          </VideoContentTop>

          <StatsContainer>
            <ContentText variant="body2">
              <span style={{ marginRight: '4px' }}>
                {numeral(viewCount).format('0.a')} views
              </span>
              <DotSeparator /> <span>{moment(publishedAt).fromNow()}</span>
            </ContentText>
          </StatsContainer>

          <AvatarContainer>
            <StyledAvatar src={channelAvatar} />
            <ContentText variant="subtitle1" style={{ paddingLeft: '8px' }}>
              {channelTitle}
            </ContentText>
          </AvatarContainer>

          <DescriptionsContainer>{description}</DescriptionsContainer>
        </ContentContainer>
      )}
    </StyledCard>
  )
}

export default ResultsVideoCard

const DescriptionsContainer = styled(Typography)`
  && {
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ContentText = styled(Typography)`
  && {
    font-size: 12px;
  }
`

const StatsContainer = styled.div`
  font-size: 12px;
`

const StyledAvatar = styled(Avatar)`
  && {
    height: 24px;
    width: 24px;
  }
`

const AvatarContainer = styled.div`
  display: flex;
  padding: 12px 0;
  align-items: center;
`

const VideoContentTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const SearchCardHeader = styled(StyledCardHeader)`
  && {
    align-items: flex-start;
    flex-grow: 1;
    padding: 0 8px;

    .MuiCardHeader-content {
      padding: 0;
    }
  }
`
const StyledImg = styled.img`
  height: 100%;
  cursor: pointer;

  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    height: auto;
    width: 100%;
  }
`

const StyledImageContainer = styled(ImageContainer)`
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    min-width: 240px;
    max-width: 360px;
    margin-right: 12px;
    flex: 1 0 50%;
    width: 100%;
  }
`

const SearchVideoTitle = styled(VideoTitle)`
  && {
    font-weight: 400;
    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      font-size: 18px;
      max-height: 52px;
      line-height: 26px;
    }
  }
`

const StyledCard = styled.div`
  margin-top: 12px;
  padding: 0 12px;
  height: 90px;
  display: flex;

  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    height: 100%;
    width: 100%;
  }
`