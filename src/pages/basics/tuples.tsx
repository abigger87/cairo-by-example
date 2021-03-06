import {
  Box,
  Text,
  Code,
  Heading,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect } from "react";

import { BackButton } from "components/layout";

const Tuples = () => {
  const { colorMode } = useColorMode();
  const textSize = useBreakpointValue({
    base: "xs",
    sm: "md",
  });

  useEffect(() => {
    localStorage.setItem("pages/basics/tuples", "visited");
  }, []);

  return (
    <>
      <BackButton />
      <Heading as="h3" fontSize="2xl">
        Tuples
      </Heading>
      <Box
        backgroundColor={colorMode === "light" ? "gray.200" : "gray.600"}
        padding={4}
        marginTop={4}
        borderRadius={4}
      >
        <Text fontSize={textSize}>
          {`%lang starknet
          %builtins pedersen range_check

          from starkware.cairo.common.cairo_builtins import HashBuiltin

          @view
          func deconstruct_tuple{
            \tsyscall_ptr: felt*,
            \tpedersen_ptr: HashBuiltin*,
            \trange_check_ptr
          }(
            \ttuple: (felt, felt)
          ) -> (
            \titem1: felt,
            \titem2: felt,
            \ttuple: (felt, felt)
          ):
            \treturn (
              \t\titem1=tuple[0],
              \t\titem2=tuple[1],
              \t\ttuple=tuple
            \t)
          end`
            .split("\n")
            .map((item, index) => {
              if (item === "") {
                return (
                  <Box fontSize={textSize} display="flex" flexDirection="row">
                    <Text userSelect="none" opacity={0.4} mr={4}>
                      {index + 1}
                    </Text>{" "}
                  </Box>
                );
              }
              return (
                <Box fontSize={textSize} display="flex" flexDirection="row">
                  <Text userSelect="none" opacity={0.4} mr={4}>
                    {index + 1}
                  </Text>{" "}
                  <Text ml={4 * (item.split("\t").length - 1)}>{item}</Text>{" "}
                </Box>
              );
            })}
        </Text>
      </Box>
      <Box my={4}>
        <Text my={2} fontSize={textSize}>
          Tuples are an ordered collection of any combination of valid types,
          including other tuples. Tuples are written as comma-separated lists of
          elements enclosed in parenthesis.
        </Text>
        <Text my={2} fontSize={textSize}>
          For example: {/* eslint-disable-next-line prettier/prettier */}
          <Code>let a = (7, 6, 5)</Code>
        </Text>
        <Text my={2} fontSize={textSize}>
          To reference an item inside the tuple, we use brackets like so:{" "}
          {/* eslint-disable-next-line prettier/prettier */}
          <Code>let a = (7, 6, 5)[2] # let a = 5</Code>
        </Text>
        <Text my={2} fontSize={textSize}>
          Since calldata and arguments and return values may be any type besides
          pointers, we can pass tuples as arguments and return values.
        </Text>
        <Text my={2} fontSize={textSize}>
          On line 12, we pass in a tuple of two felts into the{" "}
          <Code>deconstruct_tuple</Code> function. Then on lines 16 and 21, we
          demonstrate returning the original tuple.
        </Text>
      </Box>
    </>
  );
};

export default Tuples;
