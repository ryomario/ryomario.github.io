import { StyleSheet } from "@react-pdf/renderer";

const fontSizes = {
  xl: 20,
  l: 18,
  m: 14,
  s: 13,
  xs: 12,
  xxs: 10,
}

export const styles = StyleSheet.create({
  page: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    color: 'black',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    // fontFamily: 'Albert Sans',
    fontSize: fontSizes.xxs,
    justifyContent: 'flex-start',
    lineHeight: 1.3,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
})