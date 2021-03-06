import React from 'react';
import Popover from "react-bootstrap/Popover";
import ListGroup from "react-bootstrap/ListGroup";
import PopoverStickOnHover from "../PopoverStickOnHover";

export function createStyleObject(classNames, elementStyle = {}, stylesheet) {
  return classNames.reduce((styleObject, className) => {
    return { ...styleObject, ...stylesheet[className] };
  }, elementStyle);
}

export function createClassNameString(classNames) {
  return classNames.join(' ');
}

export function createChildren(stylesheet, useInlineStyles) {
  let childrenCount = 0;
  return children => {
    childrenCount += 1;
    return children.map((child, i) =>
      createElement({
        node: child,
        stylesheet,
        useInlineStyles,
        key: `code-segment-${childrenCount}-${i}`
      })
    );
  };
}

export default function createElement({
  node,
  stylesheet,
  style = {},
  useInlineStyles,
  key
}) {
  const { properties, type, tagName: TagName, value } = node;
  if (type === 'text') {
    return value;
  } else if (TagName) {
    const childrenCreator = createChildren(stylesheet, useInlineStyles);
    const nonStylesheetClassNames =
      useInlineStyles &&
      properties.className &&
      properties.className.filter(className => !stylesheet[className]);
    const className =
      nonStylesheetClassNames && nonStylesheetClassNames.length
        ? nonStylesheetClassNames
        : undefined;
    const props = useInlineStyles
      ? {
          ...properties,
          ...{ className: className && createClassNameString(className) },
          style: createStyleObject(
            properties.className,
            Object.assign({}, properties.style, style),
            stylesheet
          )
        }
      : {
          ...properties,
          className: createClassNameString(properties.className)
        };
    const children = childrenCreator(node.children);

    if (properties.hasOwnProperty('errors')) {
        let errors = properties.errors;
        let lineNumber = errors[0].lineNumber;

        let popupComponent = (<div>
                <Popover.Title as="h3">Line {lineNumber}</Popover.Title>
                <Popover.Content>
                    <ListGroup variant="flush">
                        {errors.map((error) => (
                            <ListGroup.Item>
                                {error.message}
                                &nbsp;
                                {error.infoUrl != null &&
                                <a href={error.infoUrl}
                                   target="_blank"
                                   rel="noopener noreferrer">More info</a>
                                }
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Popover.Content>
            </div>);

        return (
            <PopoverStickOnHover
                component={popupComponent}
                placement="auto-start"
                leaveDelay={400}
            >
                <TagName key={key} {...props}>
                    {children}
                </TagName>
            </PopoverStickOnHover>
        )
    }

    return (
      <TagName key={key} {...props}>
        {children}
      </TagName>
    );
  }
}