import React, { useState, useEffect } from "react";
import { OpenAPIV3 } from "openapi-types";
import { Trash } from "lucide-react";

interface SchemaObjEditorProps {
  schema: OpenAPIV3.SchemaObject;
  value: any;
  onChange: (newValue: any) => void;
  readOnly?: boolean;
}

const SchemaObjEditor: React.FC<SchemaObjEditorProps> = ({
  schema,
  value,
  onChange,
  readOnly = false,
}) => {
  const [localValue, setLocalValue] = useState<any>(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleValueChange = (newValue: any) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getFieldDescription = (propertySchema: OpenAPIV3.SchemaObject) => {
    return (
      propertySchema.description ||
      (propertySchema.format ? `Format: ${propertySchema.format}` : "") ||
      (propertySchema.minimum !== undefined
        ? `Min: ${propertySchema.minimum}`
        : "") ||
      (propertySchema.maximum !== undefined
        ? `Max: ${propertySchema.maximum}`
        : "")
    );
  };

  const renderValueEditor = (
    propertySchema: OpenAPIV3.SchemaObject,
    currentValue: any,
    path: string
  ) => {
    if (!propertySchema) return null;

    const type = propertySchema.type;
    const format = propertySchema.format;
    const description = getFieldDescription(propertySchema);
    const isRequired = propertySchema.required;

    const inputWrapperClasses = "relative group";
    const inputClasses =
      "w-full px-3 py-2 border rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 0 dark:border-gray-700 dark:focus:ring-blue-400 dark:focus:border-blue-400";
    const labelClasses =
      "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2";
    const descriptionClasses = "text-xs text-gray-500 dark:text-gray-400 mt-1";

    switch (type) {
      case "string":
        return (
          <div className={inputWrapperClasses}>
            <input
              type="text"
              value={currentValue || ""}
              onChange={(e) => {
                const newValue = { ...localValue };
                const pathParts = path.split(".");
                let current = newValue;
                for (let i = 0; i < pathParts.length - 1; i++) {
                  current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = e.target.value;
                handleValueChange(newValue);
              }}
              className={inputClasses}
              readOnly={readOnly}
              placeholder={
                propertySchema.description || `Enter ${path.split(".").pop()}`
              }
              {...(format === "date" && { type: "date" })}
              {...(format === "datetime" && { type: "datetime-local" })}
              {...(format === "email" && { type: "email" })}
              {...(format === "password" && { type: "password" })}
            />
            {description && (
              <div className={descriptionClasses}>{description}</div>
            )}
          </div>
        );

      case "number":
      case "integer":
        return (
          <div className={inputWrapperClasses}>
            <input
              type="number"
              value={currentValue || ""}
              onChange={(e) => {
                const newValue = { ...localValue };
                const pathParts = path.split(".");
                let current = newValue;
                for (let i = 0; i < pathParts.length - 1; i++) {
                  current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] =
                  type === "integer"
                    ? parseInt(e.target.value)
                    : parseFloat(e.target.value);
                handleValueChange(newValue);
              }}
              className={inputClasses}
              readOnly={readOnly}
              min={propertySchema.minimum}
              max={propertySchema.maximum}
              step={type === "integer" ? "1" : "any"}
              placeholder={
                propertySchema.description || `Enter ${path.split(".").pop()}`
              }
            />
            {description && (
              <div className={descriptionClasses}>{description}</div>
            )}
          </div>
        );

      case "boolean":
        return (
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentValue || false}
                onChange={(e) => {
                  const newValue = { ...localValue };
                  const pathParts = path.split(".");
                  let current = newValue;
                  for (let i = 0; i < pathParts.length - 1; i++) {
                    current = current[pathParts[i]];
                  }
                  current[pathParts[pathParts.length - 1]] = e.target.checked;
                  handleValueChange(newValue);
                }}
                className="sr-only peer"
                readOnly={readOnly}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            {description && (
              <span className={descriptionClasses}>{description}</span>
            )}
          </div>
        );

      case "array":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {propertySchema.title || "Items"}
              </span>
              {!readOnly && (
                <button
                  onClick={() => {
                    const newValue = { ...localValue };
                    const pathParts = path.split(".");
                    let current = newValue;
                    for (let i = 0; i < pathParts.length - 1; i++) {
                      current = current[pathParts[i]];
                    }
                    if (!current[pathParts[pathParts.length - 1]]) {
                      current[pathParts[pathParts.length - 1]] = [];
                    }
                    current[pathParts[pathParts.length - 1]].push(null);
                    handleValueChange(newValue);
                  }}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  Add Item
                </button>
              )}
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              {(currentValue || []).map((item: any, index: number) => (
                <div
                  key={index}
                  className="group relative bg-gray-50 0/50 p-3 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      {renderValueEditor(
                        propertySchema.items as OpenAPIV3.SchemaObject,
                        item,
                        `${path}[${index}]`
                      )}
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => {
                          const newValue = { ...localValue };
                          const pathParts = path.split(".");
                          let current = newValue;
                          for (let i = 0; i < pathParts.length - 1; i++) {
                            current = current[pathParts[i]];
                          }
                          current[pathParts[pathParts.length - 1]].splice(
                            index,
                            1
                          );
                          handleValueChange(newValue);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        title="Remove item"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "object":
        return (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            {Object.entries(propertySchema.properties || {}).map(
              ([key, propSchema]) => (
                <div key={key} className="space-y-2">
                  <label className={labelClasses}>
                    {key}
                    {isRequired && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </label>
                  {renderValueEditor(
                    propSchema as OpenAPIV3.SchemaObject,
                    currentValue?.[key],
                    path ? `${path}.${key}` : key
                  )}
                </div>
              )
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white 0 rounded-lg shadow-sm">
      {renderValueEditor(schema, localValue, "")}
    </div>
  );
};

export default SchemaObjEditor;
