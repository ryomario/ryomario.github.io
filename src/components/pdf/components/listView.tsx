import { StyleSheet, Text, View } from "@react-pdf/renderer"
import { Style } from "@react-pdf/types"

type Props = {
  list: string[]
  style?: Style | Style[]
  listIndex?: string
}

const listStyles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  }
})

export function ListView({
  list,
  style,
  listIndex = '-'
}: Props) {
  return (
    <View style={style}>
      {list.map((item, i) => (
        <View style={listStyles.item} key={i}>
          <Text>{listIndex}</Text>
          <Text>{item}</Text>
        </View>
      ))}
    </View>
  )
}