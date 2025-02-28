import { Text, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

type Props = {
  text: string
  style: Style
}

export function TextPerWord({ text, style }: Props) {
  return (
    <View style={[style,{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }]}>
      {text.match(/\w+\W+|\w+/g)?.map((seg, i) => (
        <Text key={i}>{seg}</Text>
      ))}
    </View>
  )
}