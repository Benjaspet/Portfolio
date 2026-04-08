'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';
import Image from 'next/image';
import { Experience, Role } from '@/app/types';
import { Timeline, TimelineDot, TimelineHeading, TimelineItem } from '@/components/ui/timeline';
import CustomTimelineItem from '@/components/timeline-item';

type ExperienceDropdownItemProps = {
    experience: Experience;
    logo: string;
    isOpen: boolean;
    onToggle: () => void;
};

const ExperienceDropdownItem = ({ experience, logo, isOpen, onToggle }: ExperienceDropdownItemProps) => {

    return (
        <div className={`border rounded-lg overflow-hidden transition-colors duration-200 ${isOpen ? 'border-[#0b6db8]' : 'border-slate-700 hover:border-[#0b6db8]'}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent/30 transition-colors duration-200"
            >
                <Image
                    src={logo || '/placeholder.svg'}
                    alt={`${experience.company} logo`}
                    width={40}
                    height={40}
                    className="object-cover rounded-md w-10 h-10 flex-shrink-0"
                />
                <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-semibold text-base text-gray-100 leading-tight truncate w-full text-left">
                        {experience.company.trim()}
                    </span>
                    {experience.roles[0] && (
                        <span className="text-sm text-muted-foreground leading-tight truncate w-full text-left">
                            {experience.roles[0].position.trim()}
                        </span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
            </button>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{
                    height: { duration: 0.28, ease: 'easeInOut' },
                    opacity: { duration: 0.28, ease: 'easeInOut' },
                }}
                className="overflow-hidden"
                aria-hidden={!isOpen}
            >
                <div className="px-5 pb-5 pt-4 border-t border-slate-700">
                    {experience.description && (
                        <p className="text-base text-muted-foreground leading-snug mb-5">
                            {experience.description}
                        </p>
                    )}
                    <Timeline>
                        {experience.roles.map((role: Role, index: number) => (
                            <CustomTimelineItem
                                key={index}
                                status={role.status}
                                role={role.position}
                                company={experience.company}
                                locationAndDate={role.location + ' • ' + role.dateRange}
                                bullets={role.bullets}
                            />
                        ))}
                        <TimelineItem>
                            <TimelineHeading>Experience began.</TimelineHeading>
                            <TimelineDot status="done" />
                        </TimelineItem>
                    </Timeline>
                </div>
            </motion.div>
        </div>
    );
};

type ExperienceDropdownProps = {
    items: { experience: Experience; logo: string }[];
};

const ExperienceDropdown = ({ items }: ExperienceDropdownProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <LayoutGroup>
            <motion.div
                layout
                transition={{ layout: { duration: 0.28, ease: 'easeInOut' } }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 items-start"
            >
                {items.map((item, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <motion.div
                            layout
                            transition={{ layout: { duration: 0.28, ease: 'easeInOut' } }}
                            key={`${index}-${item.experience.company}`}
                            className={isOpen ? 'md:col-span-2 md:order-first' : ''}
                        >
                            <ExperienceDropdownItem
                                experience={item.experience}
                                logo={item.logo}
                                isOpen={isOpen}
                                onToggle={() => setOpenIndex(isOpen ? null : index)}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </LayoutGroup>
    );
};

export default ExperienceDropdown;
