/* eslint-disable no-case-declarations */
import { FetchUserAttributesOutput, UpdateUserAttributeOutput, fetchUserAttributes, updateUserAttribute } from "aws-amplify/auth";
import { useState, useEffect, ReactNode, createContext } from "react";

export const UserAttributeContext = createContext<{
    attributes: FetchUserAttributesOutput;
    handleUpdateUserAttribute: (attributeKey: string, value: string) => void;
    refetch: () => void;
  }>({
    attributes: {}, 
    handleUpdateUserAttribute: () => {},
    refetch: () => {}
  });

export const UserAttributeProvider = ({ children } : {children: ReactNode}) => {
    const [attributes, setAttributes] = useState<FetchUserAttributesOutput>({}); // Your default value
  
    useEffect(() => {
        refetch()
    }, []);
  
    async function refetch() {
      const fetchedAttributes = await fetchUserAttributes();
      setAttributes(fetchedAttributes);
    }
  
    async function handleUpdateUserAttribute(attributeKey: string, value: string) {
        try {
          const output = await updateUserAttribute({
            userAttribute: {
              attributeKey,
              value,
            },
          });
          handleUpdateUserAttributeNextSteps(output);
          await refetch();
        } catch (error) {
          console.error(error);
        }
      }
    
      // Handle the next steps after updating a user attribute
      function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
        const { nextStep } = output;
    
        switch (nextStep.updateAttributeStep) {
          case 'CONFIRM_ATTRIBUTE_WITH_CODE':
            const codeDeliveryDetails = nextStep.codeDeliveryDetails;
            console.log(
              `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
            );
            // Collect the confirmation code from the user and pass to confirmUserAttribute.
            break;
          case 'DONE':
            console.log('Attribute was successfully updated.');
            break;
          default:
            console.log('Unhandled attribute update step.');
        }
      }
  
    // Value provided to the context consumers
    const contextValue = {
      attributes,
      refetch,
      handleUpdateUserAttribute,
    };
  
    return (
      <UserAttributeContext.Provider value={contextValue}>
        {children}
      </UserAttributeContext.Provider>
    );
  };
  