import React, { useState } from "react";
import axios from "axios";
import Step from "./Step";
import ModalContainer from "./ModalContainer";
import "../styles/Workflow.css";

const Workflow = ({ workflow, phaseDict }) => {
  const groupedByPhase = workflow.reduce((acc, subtask) => {
    acc[subtask.phase] = acc[subtask.phase] || [];
    acc[subtask.phase].push(subtask);
    return acc;
  }, {});

  // const [expandedSubtasks, setExpandedSubtasks] = useState({});
  const [expandedSteps, setExpandedSteps] = useState({});
  const [evidence, setEvidence] = useState({}); // Store evidence for each step
  const [loadingEvidence, setLoadingEvidence] = useState({});
  const [selectedStep, setSelectedStep] = useState(null); // Track selected step
  const [modalContent, setModalContent] = useState(null);

  // const toggleSubtask = (index) => {
  //   setExpandedSubtasks((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };

  const toggleStepDetails = (subtaskIndex, stepIndex) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [`${subtaskIndex}-${stepIndex}`]: !prev[`${subtaskIndex}-${stepIndex}`],
    }));
  };

  const callApiForEvidence = async (name, execution) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/process_step",
        { name: name, execution: execution },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const evidence = response.data.evidence.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));

      return evidence.length > 0
        ? evidence // Assuming you want the first evidence item
        : { title: "No evidence found.", link: "", snippet: "" };
    } catch (error) {
      console.error("Error calling API:", error);
      return { title: "Error retrieving evidence.", link: "", snippet: "" };
    }
  };

  const handleRoleCircleClick = async (
    step,
    phaseIndex,
    subtaskIndex,
    stepIndex
  ) => {
    const evidenceKey = `${phaseIndex}-${subtaskIndex}-${stepIndex}`;

    // Show loading modal
    setModalContent(
      <ModalContainer
        isLoading={true}
        step={step}
        evidence={[]}
        classification={step.classification}
      />
    );

    // Fetch evidence data
    const evidenceItem = await callApiForEvidence(step.name, step.execution);
    setEvidence((prev) => ({
      ...prev,
      [evidenceKey]: evidenceItem,
    }));

    setLoadingEvidence((prev) => ({ ...prev, [evidenceKey]: false }));

    // Update modal with evidence data
    setModalContent(
      <ModalContainer
        isLoading={false}
        step={step}
        evidence={evidence[evidenceKey] || []}
        classification={step.classification}
      />
    );
  };

  const resetSelection = () => {
    setSelectedStep(null);
    setModalContent(null);
  };

  const handleStepClick = (phaseIndex, subtaskIndex) => {
    setSelectedStep({ phaseIndex, subtaskIndex });
  };

  return (
    <>
      <div className="workflow-container" onClick={resetSelection}>
        {Object.entries(groupedByPhase).map(([phase, subtasks], phaseIndex) => (
          <div key={phase} className={`phase-row`}>
            <div
              className={`"phase-label-container"  ${
                selectedStep ? "faded-out" : ""
              }`}
            >
              <span className="phase-label-text">
                {`PHASE ${phaseIndex + 1} - ${
                  phaseDict[phase] || `Phase ${phase}`
                }`}
              </span>
            </div>
            <div className={`subtasks-wrapper `}>
              {subtasks.map((subtask, subtaskIndex) => {
                const isSelected =
                  selectedStep &&
                  selectedStep.subtaskIndex === subtaskIndex &&
                  selectedStep.phaseIndex === phaseIndex;

                return (
                  <>
                    {isSelected && (
                      <div
                        key={`${subtaskIndex}-placeholder`}
                        className="subtask-placeholder"
                      >
                        <h2 className="subtask-title">{subtask.description}</h2>

                        {/* {expandedSubtasks[`${phaseIndex}-${subtaskIndex}`] && ( */}
                        {
                          <div className="steps">
                            {subtask.steps.map((step, stepIndex) => {
                              const evidenceKey = `${phaseIndex}-${subtaskIndex}-${stepIndex}`;
                              return (
                                <div
                                  key={stepIndex}
                                  className="step"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStepDetails(
                                      `${phaseIndex}-${subtaskIndex}`,
                                      stepIndex
                                    );
                                  }}
                                >
                                  <div className="step-header">
                                    <div className="step-indexCircle">
                                      {stepIndex + 1}
                                    </div>
                                    <div className="step-name">{step.name}</div>
                                    <div
                                      className={`step-roleCircle`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRoleCircleClick(
                                          step,
                                          phaseIndex,
                                          subtaskIndex,
                                          stepIndex
                                        );
                                      }}
                                    ></div>
                                  </div>

                                  {expandedSteps[
                                    `${phaseIndex}-${subtaskIndex}-${stepIndex}`
                                  ] && (
                                    <div className="step-details">
                                      <div className="step-attribute">
                                        <strong>Classification:</strong> <br />
                                        {step.classification}
                                      </div>
                                      <div className="step-attribute">
                                        <strong>Role:</strong> <br />
                                        {step.execution}
                                      </div>
                                      <div className="step-attribute">
                                        <strong>Evidence:</strong> <br />
                                        {loadingEvidence[evidenceKey]
                                          ? "Loading evidence..."
                                          : evidence[evidenceKey]?.title ||
                                            "Click the role circle to fetch evidence."}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        }
                      </div>
                    )}
                    <div
                      key={subtaskIndex}
                      className={`subtask ${
                        !selectedStep
                          ? ""
                          : selectedStep.subtaskIndex !== subtaskIndex ||
                            selectedStep.phaseIndex !== phaseIndex
                          ? "faded-out"
                          : "selected"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent reset on subtask click
                        // toggleSubtask(`${phaseIndex}-${subtaskIndex}`);
                        handleStepClick(phaseIndex, subtaskIndex);
                      }}
                    >
                      <h2 className="subtask-title">{subtask.description}</h2>

                      {/* {expandedSubtasks[`${phaseIndex}-${subtaskIndex}`] && ( */}
                      {
                        <div className="steps">
                          {subtask.steps.map((step, stepIndex) => {
                            const evidenceKey = `${phaseIndex}-${subtaskIndex}-${stepIndex}`;
                            return (
                              <Step
                                key={stepIndex}
                                step={{ ...step, index: stepIndex }} // Include step index
                                evidenceKey={evidenceKey}
                                expanded={
                                  expandedSteps[
                                    `${phaseIndex}-${subtaskIndex}-${stepIndex}`
                                  ]
                                }
                                onToggle={(e) => {
                                  e.stopPropagation();
                                  toggleStepDetails(
                                    `${phaseIndex}-${subtaskIndex}`,
                                    stepIndex
                                  );
                                }}
                                onRoleCircleClick={() =>
                                  handleRoleCircleClick(
                                    step,
                                    phaseIndex,
                                    subtaskIndex,
                                    stepIndex
                                  )
                                }
                                evidence={evidence[evidenceKey]}
                                loading={loadingEvidence[evidenceKey]}
                              />
                            );
                          })}
                        </div>
                      }
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="parent-container">
        {/* Modal Container */}
        {modalContent && modalContent}
      </div>
    </>
  );
};

export default Workflow;
