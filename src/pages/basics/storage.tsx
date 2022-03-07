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

const Storage = () => {
  const { colorMode } = useColorMode();
  const textSize = useBreakpointValue({
    base: "xs",
    sm: "md",
  });

  useEffect(() => {
    localStorage.setItem("pages/basics/storage", "visited");
  }, []);

  return (
    <>
      <BackButton />
      <Heading as="h3" fontSize="2xl">
        Storage
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

          @storage_var
          func count() -> (res: felt):
          end

          # Function to get the current balance.
          @view
          func get{
            \tsyscall_ptr: felt*,
            \tpedersen_ptr: HashBuiltin*,
            \trange_check_ptr
          }() -> (
            \tvalue: felt
          ):
            \tlet (value) = count.read()
            \treturn (value)
          end

          # Function to increment the count by 1.
          @external
          func increment{
            \tsyscall_ptr: felt*,
            \tpedersen_ptr: HashBuiltin*,
            \trange_check_ptr
          }():
            \tlet (res) = count.read()
            \tcount.write(res + 1)
            \treturn ()
          end

          # Function to decrement the count by 1.
          @external
          func decrement{
            \tsyscall_ptr: felt*,
            \tpedersen_ptr: HashBuiltin*,
            \trange_check_ptr
          }():
            \tlet (res) = count.read()
            \tcount.write(res - 1)
            \treturn ()
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
          The first line of code <Code>%lang starknet</Code> instructs Cairo to
          interpret the file as a Starknet contract.
        </Text>
        <Text my={2} fontSize={textSize}>
          This is necessary for every <Code>.cairo</Code> file that should be
          interpreted as a Starknet contract.
        </Text>
        <Text my={2} fontSize={textSize}>
          Next, the directive <Code>%builtins pedersen range_check</Code>{" "}
          instructs the compiler that our program will use the
          &quot;range_check&quot; builtin. As we saw in Hello World, this
          builtin ensures numbers stay within the acceptable range. Alongside,
          the &quot;pedersen&quot; builtin allows us to use the Pedersen Hash
          Function - required in many native operations (as we will see soon).
        </Text>
        <Text my={2} fontSize={textSize}>
          On line 4, we import the <Code>HashBuiltin</Code> type, required when
          passing <Code>pedersen_ptr</Code> as a function argument.
        </Text>
        <Text my={2} fontSize={textSize}>
          Since Cairo programs are stateless, Starknet exposes a canonical
          method of creating a storage variable as written on lines 6-8. Here we
          are defining a variable called <Code>count</Code> that stores a{" "}
          <Code>felt</Code>.
        </Text>
        <Text my={2} fontSize={textSize}>
          From lines 10-21, we define a simple function to get the value of our
          counter storage variable. Before we even start to implement the
          function, we place a decorator (the <Code>@view</Code> bit) above the
          definition to instruct Cairo that our function is externally visible
          and read-only on Starknet. <i>By default</i>, functions without a
          decorator are only visible from inside the contract (analagous to{" "}
          <Code>private</Code> or <Code>internal</Code> in Solidity).
        </Text>
        <Text my={2} fontSize={textSize}>
          Inside the function, we fetch the value of the count variable by using{" "}
          <Code>let (value) = count.read()</Code>. Then, on line 20, we return
          the value. If our value had a different name (ex: diff_name) than the
          return variable, we would have to explicity assign the value to the
          return variable by changing line 20 to{" "}
          <Code>return (value=diff_name)</Code>.
        </Text>
        <Text my={2} fontSize={textSize}>
          Note: The three implicit arguments or parameters in all the functions
          (ex: line 13-15) are necessary to read/write to our storage variable.
          This is because the storage operations need these parameters to
          compute the memory address of the storage variable. Aside, the{" "}
          <Code>syscall_ptr</Code> implicit arg is unique to Starknet, and not
          available in vanilla cairo. It is required to perform system calls for
          accessing storage (for interacting with the storage variable).
        </Text>
        <Text my={2} fontSize={textSize}>
          Another Note: we don&apos;t need to explicitly type the{" "}
          <Code>range_check_ptr</Code> implicit parameter since untyped
          variables are assigned the default field element type:{" "}
          <Code>felt</Code>.
        </Text>
        <Text my={2} fontSize={textSize}>
          The next two functions (increment and decrement) are very similar,
          both being marked <Code>@external</Code>. This decorator exposes the
          function externally to Starknet and allows it to modify contract
          state(whereas a <Code>@view</Code> function can only read from state).
        </Text>
        <Text my={2} fontSize={textSize}>
          Note: A function without either of these decorators is only accesible
          from within the contract.
        </Text>
        <Text my={2} fontSize={textSize}>
          Another important note is both the increment and decrement functions
          differ from the <Code>get</Code> function on line 12 in that they
          don&apos;t have return types. This is annotated on lines 29 and 41
          where the function definition occurs after the parameter list in the
          parenthesis. If we wanted to add a return variable, we would change{" "}
          <Code>{"}"}():</Code> to <Code>{"}"}() -&gt; ():</Code> and add return
          variables inside the second set of parenthesis (as in the{" "}
          <Code>get</Code> function on lines 16-18).
        </Text>
      </Box>
    </>
  );
};

export default Storage;
