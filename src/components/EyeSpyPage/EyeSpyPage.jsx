import React from "react";
import axios from "axios";
import { SiteHeader } from "../../components/SiteHeader/SiteHeader";
import SiteHtmlHelmetHead from "../SiteHtmlHelmetHead";
import HtmlClassManager from "../HtmlClassManager";
import Footer from "../Footer/Footer";
import StickyList from "../StickyList/StickyList";
import {
  META_TITLE,
  META_DESCRIPTION,
  DEFAULT_ROOM_ORDER,
} from "../../constants";
import { parseObject } from "../../objectDataUtils";
import { formatTourData } from "../TourPage/tourPageHelper";
import NotFound from "../NotFound/notFound";

export default class EyeSpyPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tourId: null,
      title: null,
      description: null,
      objects: null,
      roomOrder: null,
      heroImgSrc: null,
      metaImgUrl: null,
    };
  }

  async componentDidMount() {
    // Extract the slug for this tour
    const { id } = this.props.match.params;

    // If we have a slug, retrieve information for the tour
    if (id) {
      try {
        const tourResponse = await axios.get(`/api/tour/eyeSpy/${id}`);
        const tourData = tourResponse.data;
        const objects = tourData.objects;
        const clues = tourData.clues;
        const languages = tourData.translations ? Object.keys(tourData.translations) : []

        const roomOrder = tourData.customRoomOrder.length
          ? tourData.customRoomOrder
          : DEFAULT_ROOM_ORDER;

        const heroImageInvno = tourData.heroImageInvno;
        const object = objects.find((obj) => obj._source.invno === heroImageInvno);
        const parsedObject = parseObject(object._source);
        const sections = formatTourData(roomOrder, objects, clues)

        this.setState({
          title: tourData.title,
          subtitle: tourData.subtitle,
          description: tourData.description,
          heroImageSrc: parsedObject.imageUrlLarge,
          heroImageStyle: tourData.heroImageStyle,
          metaImgUrl: parsedObject.imageUrlSmall,
          sections: sections,
          selectedLanguage: "English",
          languages: ["English", ...languages],
          tourData: tourData,
        });
      } catch (error) {
        console.log(
          `An error occurred retrieving the tour for id ${id}`,
          error
        );
      } finally {
        this.setState({
          ...this.state,
          tourId: id,
        });
      }
    }
  }

  // Handles updating the copy based on the selected language
  handleSelectLanguage(language) {
    const tourData = this.state.tourData
    const roomOrder = tourData.customRoomOrder.length
    ? tourData.customRoomOrder
    : DEFAULT_ROOM_ORDER;
    const objects = tourData.objects


    if (language === "English") {
      const sections = formatTourData(roomOrder, objects, tourData.clues)

      this.setState({
        ...this.state,
        title: tourData.title,
        subtitle: tourData.subtitle,
        description: tourData.description,
        sections: sections,
        selectedLanguage: "English",
      })
    } else {
      // Default to English translation if any fields aren't provided
      const translation = tourData.translations[language]
      const clues = translation.clues || tourData.clues
      const sections = formatTourData(roomOrder, objects, clues)

      this.setState({
        ...this.state,
        title: translation.title || tourData.title,
        subtitle: translation.subtitle || tourData.subtitle,
        description: translation.description || tourData.description,
        sections: sections,
        selectedLanguage: language,
      })
    }
  }

  getMetaTags(title) {
    const metaTitle = `${META_TITLE} — ${title}`;
    const metaDescription = `Barnes Foundation Collection: ${title} -- ${META_DESCRIPTION}`;

    return {
      title: metaTitle,
      description: metaDescription,
      image: this.state.metaImgUrl,
    };
  }

  render() {
    const {
      tourId,
      title,
      sections,
    } = this.state;

    return (
      tourId && title && sections ? (
        <div className="app app-eyespy-page">
          <SiteHtmlHelmetHead metaTags={this.getMetaTags(title)} />
          <HtmlClassManager />
          <SiteHeader isTour />
            {/* Display the tour if it was located */}
          <div>
            <StickyList
              {...this.state}
              handleSelectLanguage={(this.handleSelectLanguage).bind(this)}
            />
          </div>
          <Footer />
        </div>
        ) : (
            // Otherwise, no tour found for that id
            <NotFound/>
            )
    )
  }
}
