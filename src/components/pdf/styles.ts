import {
  Font,
  StyleSheet
} from "@react-pdf/renderer";

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
      fontStyle: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-italic-webfont.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bolditalic-webfont.ttf',
      fontWeight: 'bold',
      fontStyle: 'italic',
    }
  ],
});

export const fontStyles = StyleSheet.create({
  heading_1: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  heading_2: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  heading_3: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 1.3,
  },
  normal: {
    fontSize: 12,
    fontWeight: 'normal',
    marginTop: 10,
  },
  center: {
    textAlign: 'center',
  },
  section_title: {
    lineHeight: 1.5,
    opacity: 0.6,
  },
  muted: {
    color: '#808080',
  },
  hr: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000000',
    marginVertical: 10,
  },
})

export const styles = StyleSheet.create({
  page: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    fontFamily: 'Roboto',
    fontSize: 10,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  profileImg: {
    width: 117,
    height: 117,
    minWidth: 117,
    minHeight: 117,
    borderTopLeftRadius: '50%',
    borderTopRightRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderBottomRightRadius: '50%',
    backgroundColor: '#eeeeee',
  },
  section: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  work_section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
})