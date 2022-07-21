import { Box, Button, Divider, HStack, Text } from '@chakra-ui/react'
import {
  faBolt,
  faBoltSlash,
  faChevronDown,
  faEye,
  faEyeSlash,
  faLambda,
  faNewspaper,
} from '@fortawesome/pro-solid-svg-icons'
import { memo } from 'react'
import { pokemonTypeData } from '../../data/pokemon-types'
import { useSelectedPokemonTypes } from '../../hooks/useSelectedPokemonTypes'
import Icon from '../icon'

const PokemonTypeFilter = () => {
  const {
    clearAllSelectedTypes,
    selectedTypes,
    selectAllTypes,
    totalTypes,
    exactFilterEnabled,
    isSelected,
    removeSelectedType,
    setExactFilterEnabled,
    addSelectedType,
    weakFilterEnabled,
    setWeakFilterEnabled,
    isExpanded,
    setIsExpanded,
    typeSummaryIsVisible,
    setTypeSummaryIsVisible,
  } = useSelectedPokemonTypes()

  const handleClick = (type: PokemonTypes) => {
    if (selectedTypes.length === 2) {
      clearAllSelectedTypes()
    }

    if (isSelected(type)) {
      removeSelectedType(type)
    } else {
      addSelectedType(type)
    }
  }

  return (
    <Box overflow="hidden">
      <Box
        display="grid"
        gridAutoFlow="column"
        pb={2}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        // overflow="hidden"
        gridGap={2}
        gridTemplateColumns="auto 1fr auto"
      >
        <Text
          mr={2}
          fontSize={14}
          color="gray.700"
          fontWeight="700"
          textTransform="uppercase"
        >
          Types
        </Text>
        <HStack
          w="100%"
          justifyContent="flex-end"
          overflowX="scroll"
          shouldWrapChildren
        >
          <Button
            size={['xs', 'sm']}
            variant="outline"
            isActive={typeSummaryIsVisible}
            onClick={() => {
              setTypeSummaryIsVisible(!typeSummaryIsVisible)
            }}
            title={
              typeSummaryIsVisible ? 'Hide Type Summary' : 'Show Type Summary'
            }
          >
            <Icon w="14px" icon={faNewspaper} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Summary
            </Box>
          </Button>
          <Button
            size={['xs', 'sm']}
            variant="outline"
            isActive={weakFilterEnabled}
            onClick={() => {
              setWeakFilterEnabled(!weakFilterEnabled)
            }}
            title="Show types that are weak to selected types"
          >
            <Icon
              w="14px"
              maxH={weakFilterEnabled ? '12px' : '14px'}
              icon={weakFilterEnabled ? faBolt : faBoltSlash}
            />
            <Box as="span" ml={1} display={['none', 'block']}>
              Weak Against
            </Box>
          </Button>
          <Button
            size={['xs', 'sm']}
            variant="outline"
            isActive={exactFilterEnabled}
            onClick={() => {
              setExactFilterEnabled(!exactFilterEnabled)
            }}
            title="Exact Match"
          >
            <Icon w="14px" maxH="14px" icon={faLambda} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Exact Match
            </Box>
          </Button>
          <Button
            size={['xs', 'sm']}
            onClick={clearAllSelectedTypes}
            isActive={selectedTypes.length > 0}
            isDisabled={selectedTypes.length === 0}
            title="Clear All"
          >
            <Icon w="14px" icon={faEyeSlash} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Clear All
            </Box>
          </Button>
          <Button
            size={['xs', 'sm']}
            onClick={() => {
              selectAllTypes()
            }}
            isActive={selectedTypes.length < totalTypes}
            isDisabled={
              selectedTypes.length === totalTypes ||
              exactFilterEnabled ||
              weakFilterEnabled
            }
            title="Select All"
          >
            <Icon w="14px" icon={faEye} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Select All
            </Box>
          </Button>
        </HStack>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size={['xs', 'sm']}
          transform={isExpanded ? 'rotate(180deg)' : undefined}
          variant="ghost"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          <Icon fixedWidth w="12px" icon={faChevronDown} />
        </Button>
      </Box>
      <Divider borderColor="gray.400" mb={3} />
      <Box
        display="grid"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        gridGap={[2, null, 4]}
        gridAutoFlow={isExpanded ? 'row' : 'column'}
        gridTemplateColumns={
          isExpanded
            ? [
                'repeat(auto-fill, minmax(90px, auto))',
                null,
                null,
                'repeat(9, auto)',
              ]
            : 'unset'
        }
        overflowX="scroll"
      >
        {(Object.keys(pokemonTypeData) as PokemonTypes[]).map(type => (
          <TypeBadge key={type} type={type} handleClick={handleClick} />
        ))}
      </Box>
    </Box>
  )
}

export default PokemonTypeFilter

const TypeBadge = memo(
  ({ type, handleClick }: { type: PokemonTypes; handleClick: any }) => {
    const { icon, primary, color } = pokemonTypeData[type]
    const { isSelected, isExpanded } = useSelectedPokemonTypes()
    return (
      <Button
        minW="auto"
        size="xs"
        py={[0, 1]}
        m={0}
        p="5px"
        onClick={() => handleClick(type)}
        fontSize="xs"
        fontWeight={700}
        borderRadius={25}
        textTransform="uppercase"
        borderWidth={2}
        borderColor="transparent"
        transition="all 0.2s ease"
        _hover={{
          borderColor: primary,
          color: isSelected(type) ? color : primary,
        }}
        bgColor={isSelected(type) ? primary : 'gray.200'}
        color={isSelected(type) ? color : 'gray.600'}
      >
        {/* Supports for react-icons */}
        {/* {typeof icon === 'function' && (
          <Box mr={1} minW="14px" fontSize="14px">
            {(icon as any)()}
          </Box>
        )} */}
        {typeof icon === 'object' && (
          <Icon
            w="12px"
            h="12px"
            icon={icon}
            mr={isExpanded ? 1 : [0, null, 1]}
          />
        )}
        <Box display={!isExpanded ? ['none', null, 'block'] : 'unset'}>
          {type}
        </Box>
      </Button>
    )
  },
)

TypeBadge.displayName = 'TypeBadge'
