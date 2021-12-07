import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { toThousands } from '../../../utils'

const Detail = ({ dataSource }) => (
  <View style={styles.detailContainer}>
    {dataSource.map((_item, _index) => (
      <View
        style={[
          styles.detailItemView,
          dataSource.length > 1 && { borderTopWidth: 1, borderTopColor: '#E8EEF1' },
        ]}
        key={_index}>
        {_item.map((item, index) => (
          <View style={styles.detailItem} key={index}>
            <Text style={styles.detailItemName}>{item.name}</Text>
            <Text style={styles.detailItemValue}>
              {index === 1
                ? typeof item.value === 'string'
                  ? item.value
                  : `PHP ${toThousands(item.value)}`
                : item.value}
            </Text>
          </View>
        ))}
      </View>
    ))}
  </View>
)
export default Detail

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 16,
    // paddingTop: 19.5,
    // paddingBottom: 15.5,
    marginTop: 9.5,
  },
  detailItemView: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 21.5,
    paddingBottom: 13,
  },
  detailItem: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailItemName: {
    color: '#6F6F6F',
    fontSize: 13,
    marginBottom: 6,
    // fontFamily: 'HelveticaNeue',
  },
  detailItemValue: {
    color: '#1d1d1d',
    fontSize: 18,
    fontFamily: 'ArialRoundedMTBold',
  },
})
